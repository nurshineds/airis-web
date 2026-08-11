const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                success: false,
                message: "Akses ditolak. Token tidak ditemukan."
            });
        }

        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Akses ditolak. Token tidak valid."
            });
        }

        const decoded = jwt.verify(token, ProcessingInstruction.env.JWT_SECRET);

        req.admin = {
            idAdmin: decoded.idAdmin,
            username: decoded.username
        };

        next();
    } catch(error){
        if(error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token kadaluarsa. Silakan log in kembali."
            });
        }

        if(error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Token tidak valid."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Autentikasi gagal."
        });
    }
};

module.exports = { authAdmin };