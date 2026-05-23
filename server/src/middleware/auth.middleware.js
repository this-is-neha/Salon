const jwt = require("jsonwebtoken");

const adminCheck = async (req, res, next) => {
    try {
    
        console.log("Admin authorization request reached");
        
        let token = req.headers["authorization"] || req.headers["x-access-token"];
        console.log("Raw Token Header Received:", token);
        
        if (!token) {
            console.log("Authentication Failed: Missing token header.");
            return res.status(401).json({ status: false, message: "Authorization token required." });
        }

        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
            console.log("Extracted JWT String (After 'Bearer ' split):", token);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "YOUR_SECRET_KEY");
        console.log(" JWT Successfully Decoded!");
        console.log("Decoded Token Payload Structure:", JSON.stringify(decoded, null, 2));
        console.log("User Role in Payload:", decoded.role);
        if (!decoded.role || decoded.role !== "Admin" && decoded.role.toLowerCase() !== "admin") {
            console.log(`Access Denied: User role is '${decoded.role}', but exactly 'Admin' is required.`);
          
            return res.status(403).json({ 
                status: false, 
                message: "Access denied. This resource is restricted to system administrators only." 
            });
        }

        console.log("Admin Authorized! Passing control to controller action.");
       
        
        req.authUser = decoded; 
        return next(); 
        
    } catch (error) {
        console.error(" JWT Verification/System Error Exception Caught:");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
     
        
        return res.status(401).json({ 
            status: false, 
            message: error.name === "TokenExpiredError" ? "Token has expired." : "Unauthorized access." 
        });
    }
};

module.exports = adminCheck;