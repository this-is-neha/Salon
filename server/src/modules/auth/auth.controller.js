const mailSvc = require("../../modules/services/mail.services");
const bcrypt = require("bcryptjs");
const authSvc = require("./auth.service");
const jwt = require("jsonwebtoken");

class AuthController {

register = async (req, res, next) => {
    try {
        console.log("Incoming request to register user:", req.body);

        const data = authSvc.transformRegisterData(req);
        const registeredUser = await authSvc.createUser(data);

        const activationUrl = `${process.env.BACKEND_API_URL}/auth/activate/${registeredUser.activationToken}`;

        await mailSvc.sendEmail(
            registeredUser.email,
            "Activate your Account!",
            `Dear ${registeredUser.name || "User"},<br/>
            <p>You have registered your account with username <strong>${registeredUser.email}</strong>.</p>
            <p>Please click the button below to activate your account:</p>
            <p>
                <a href="${activationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">
                    Click here to instantly activate your account
                </a>
            </p>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${activationUrl}</p>
            <br/>
            <p>Regards,</p>
            <p>${process.env.SMTP_FROM || "Salon Management System"}</p>`
        );

        res.json({
            result: registeredUser,
            message: "User registered successfully. Please verify your email.",
            meta: null,
        });
    } catch (exception) {
        console.error("Exception caught inside register controller", exception);
        next(exception);
    }
};

 login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

   
    const userDetails = await authSvc.findOneUser({ email: email });
    if (!userDetails) {
      return res
        .status(422)
        .json({ message: "User credentials do not match our records." });
    }

    
    if (bcrypt.compareSync(password, userDetails.password_hash)) {
  
      if (!userDetails.is_verified) {
        return res.status(400).json({
          message: "Your account has not been activated. Please check your email inbox to verify your account.",
        });
      }

    
      const accessToken = jwt.sign(
        { 
          sub: userDetails.id,       
          role: userDetails.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
        { 
          sub: userDetails.id,      
          role: userDetails.role      
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

     
      delete userDetails.password_hash;

      return res.json({
        result: {
          detail: userDetails,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        message: "User logged in successfully",
        meta: null,
      });
    } else {
      return res.status(422).json({ message: "Credentials don't match" });
    }
  } catch (exception) {
    console.error("Error in login", exception);
    next(exception);
  }
};

  activate = async (req, res, next) => {
    try {
      const token = req.params.token;
      const associatedUser = await authSvc.findUserByActivationToken(token);

      if (!associatedUser) {
    
        return res.redirect(
          `${process.env.FRONTEND_URL}/activation-error?message=Expired or invalid token`,
        );
      }

      // Perform activation parameters adjustments in DB
      await authSvc.activateUserAccount(associatedUser.id, token);

      // INSTANT REDIRECT: Sends the user directly to the frontend login page upon click!
      return res.redirect(`${process.env.FRONTEND_URL}/login?activated=true`);
    } catch (exception) {
      console.error("Error in activation flow sequence", exception);
      next(exception);
    }
  };

  getAllUsers = async (req, res, next) => {
    try {
      const users = await authSvc.all();
      res.json({
        result: users,
        message: "All users retrieved successfully",
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getLoggedIn = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Authorization header missing or invalid" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await authSvc.findOneUser({ id: decoded.sub });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User reference target not found" });
      }

      delete user.password_hash;

      res.json({
        result: user,
        message: "Your Profile Data Profile",
        meta: null,
      });
    } catch (exception) {
      console.error("Error in getLoggedIn:", exception);
      res.status(401).json({ message: "Session token invalid or expired" });
    }
  };

  
 loginCheck = async (req, res, next) => {
      try {
          console.log("Request reached");
          let token = req.headers["authorization"] || req.headers["x-access-token"];
          
          if (!token) {
              // Instead of throwing and relying on a global handler, return a direct 401 response
              return res.status(401).json({ status: false, message: "Authorization token required." });
          }
  
          if (token.startsWith("Bearer ")) {
              token = token.split(" ")[1];
          }
  
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "YOUR_SECRET_KEY");
          
          req.authUser = decoded; 
          next(); 
          
      } catch (error) {
          console.error("JWT Verification Error:", error.message);
        
          return res.status(401).json({ 
              status: false, 
              message: error.name === "TokenExpiredError" ? "Token has expired." : "Unauthorized access." 
          });
      }
  };
  
 
}

module.exports = new AuthController();
