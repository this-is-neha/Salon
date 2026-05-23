const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../../config/db.config'); // Path to your module.exports = pool file

class AuthService {
    
    
transformRegisterData = (req) => {
    try {
        const payload = req.body;
        const file = req.file;
        
        const hashedPassword = bcrypt.hashSync(payload.password, 10);
        const token = crypto.randomBytes(32).toString('hex');

        return {
            name: payload.name,
            email: payload.email,
            password_hash: hashedPassword,
            // Convert to lowercase to perfectly match the DB enum
            role: payload.role ? payload.role.toLowerCase() : 'customer', 
            token: token
        };
    } catch (exception) {
        console.error("Error in transformRegisterData", exception);
        throw exception;
    }
};


    createUser = async (data) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const userQuery = `
                INSERT INTO users (name, email, password_hash, role, is_verified) 
                VALUES ($1, $2, $3, $4, false) 
                RETURNING id, name, email, role, is_verified, created_at;
            `;
            const userRes = await client.query(userQuery, [
                data.name, 
                data.email, 
                data.password_hash, 
                data.role
            ]);
            const createdUser = userRes.rows[0];
            const verifyQuery = `
                INSERT INTO email_verifications (user_id, token, expires_at) 
                VALUES ($1, $2, NOW() + INTERVAL '24 hours');
            `;
            await client.query(verifyQuery, [createdUser.id, data.token]);

            await client.query('COMMIT');
            createdUser.activationToken = data.token;
            return createdUser;
        } catch (exception) {
            await client.query('ROLLBACK');
            console.error("Error in createUser transaction", exception);
            throw exception;
        } finally {
            client.release();
        }
    };

    // Generic filter implementation mapped to SQL column structures
    findOneUser = async (filter) => {
        try {
            let query = `SELECT * FROM users WHERE 1=1`;
            const values = [];
            let counter = 1;

            if (filter.email) {
                query += ` AND email = $${counter}`;
                values.push(filter.email);
                counter++;
            }
            if (filter.id) {
                query += ` AND id = $${counter}`;
                values.push(filter.id);
                counter++;
            }

            const res = await db.query(query, values);
            return res.rows[0] || null;
        } catch (exception) {
            console.error("Error in findOneUser", exception);
            throw exception;
        }
    };

    // Lookup token relationships across the email link table joining user properties
    findUserByActivationToken = async (token) => {
        try {
            const query = `
                SELECT u.*, ev.token as verification_token, ev.expires_at 
                FROM email_verifications ev
                JOIN users u ON ev.user_id = u.id
                WHERE ev.token = $1 AND ev.expires_at > NOW();
            `;
            const res = await db.query(query, [token]);
            return res.rows[0] || null;
        } catch (exception) {
            console.error("Error in findUserByActivationToken", exception);
            throw exception;
        }
    };

    // Performs updates on the user verification flag status parameter
    activateUserAccount = async (userId, token) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Set user verification property true
            await client.query(`UPDATE users SET is_verified = true WHERE id = $1`, [userId]);
            
            // Remove token record once consumed
            await client.query(`DELETE FROM email_verifications WHERE token = $1`, [token]);

            await client.query('COMMIT');
            return true;
        } catch (exception) {
            await client.query('ROLLBACK');
            console.error("Error in activateUserAccount", exception);
            throw exception;
        } finally {
            client.release();
        }
    };

    // Fetch lists matching simple user schema formats
    all = async () => {
        try {
            const res = await db.query('SELECT id, name, email, role, is_verified, created_at FROM users ORDER BY created_at DESC');
            return res.rows;
        } catch (exception) {
            console.error("Error in all", exception);
            throw exception;
        }
    };
}

module.exports = new AuthService();