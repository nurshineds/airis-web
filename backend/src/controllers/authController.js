// FILE CONTROLLER UNTUK AUTENTIKASI ADMIN, BELUM PAKE BCRYPT SAMA JWT
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// BUAT AKUN ADMIN
exports.signin = async (req, res) => {
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({
                success: false,
                message: "Username dan password harus diisi!"
            });
        }

        const adminExist = await prisma.admin.findUnique({
            where: {username}
        });

        if(adminExist){
            return res.status(400).json({
                success: false,
                message: "Username sudah digunakan."
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
            message: "Sign in berhasil",
            admin: {
                idAdmin: admin.idAdmin,
                username: admin.username
            },
        });
    } catch(error){
        console.error("Sign in error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan."
        });
    }
}

// LOGIN ADMIN
exports.login = async (req, res) => {
    try{
        const { username, password } = req.body;

        if(!username || !password){
            return res.status(400).json({
                success: false,
                message: "Username dan password harus diisi!"
            });
        }

        const admin = await prisma.admin.findUnique({
            where: {username}
        });

        if(!admin){
            return res.status(401).json({
                success: false,
                message: "Username atau password salah."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid){
            return res.status(401).json({
                success: false,
                message: "Username atau password salah."
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
            message: "Login berhasil",
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
            message: "Terjadi kesalahan."
        });
    }
};

// GET PROFILE ADMIN
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
                message: "Akun tidak ditemukan."
            });
        }

        res.json({
            success: true,
            message: "Berhasil mengambil data profil admin.",
            data: admin
        });
    } catch(error){
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan."
        });
    }
};

// LOGOUT ADMIN
exports.logout = async(req, res) => {
    res.json({
        success: true,
        message: "Berhasil logout."
    });
};