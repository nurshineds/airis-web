//Arga wuz here
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

exports.signin = async (req, res) => {
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({
                success: false,
                message: "Username and password are required!"
            });
        }

        const adminExist = await prisma.admin.findUnique({
            where: {username}
        });

        if(adminExist){
            return res.status(400).json({
                success: false,
                message: "This username is already taken."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.admin.create({
            data: {
                username: username,
                password: hashedPassword
            }
        });

        const token = jwt.sign(
            {
            idAdmin: admin.idAdmin,
            username: admin.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            success: true,
            message: "Sign in successful.",
            admin: {
                idAdmin: admin.idAdmin,
                username: admin.username
            },
        });
    } catch(error){
        console.error("Sign in error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred."
        });
    }
}

exports.login = async (req, res) => {
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({
                success: false,
                message: "Username and password are required!"
            });
        }

        const admin = await prisma.admin.findUnique({
            where: {username}
        });

        if(!admin){
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid){
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const token = jwt.sign(
            {
            idAdmin: admin.idAdmin,
            username: admin.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            success: true,
            message: "Login successful.",
            token,
            admin: {
                idAdmin: admin.idAdmin,
                username: admin.username
            },
        });
    } catch(error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred."
        });
    }
};

exports.getProfileAdmin = async(req, res) => {
    try{
        const admin = await prisma.admin.findUnique({
            where: { idAdmin: req.admin.idAdmin },
            select: {
                idAdmin: true,
                username: true
            }
        });

        if(!admin){
            return res.status(404).json({
                success: false,
                message: "Account not found."
            });
        }

        res.json({
            success: true,
            message: "Admin profile data retrieved successfully.",
            data: admin
        });
    } catch(error){
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred."
        });
    }
};

exports.logout = async(req, res) => {
    res.json({
        success: true,
        message: "Logged out successfully."
    });
};

//dengan segala puji bagi tuhan pencipta alam semesta. code ini hanya dirimulah yang tau benar dan salahnya. hambamu yang fana dan naif ini hanya bisa mengikuti tutorial yutub dari orang india berumur 20 tahunan