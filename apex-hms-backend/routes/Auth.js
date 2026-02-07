const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Added this missing import
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ==========================================
// HOSPITAL REGISTRATION
// ==========================================
router.post('/hospital/register', async (req, res) => {
    try {
        const {
            hospitalName,
            hospitalType,
            address,
            phone,
            email,
            licenseNumber,
            adminName,
            password
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newHospital = await prisma.hospital.create({
            data: {
                hospitalName,
                hospitalType: hospitalType.toLowerCase(),
                address,
                phone,
                email,
                licenseNumber,
                adminName,
                passwordHash: hashedPassword,
                status: 'pending'
            }
        });

        res.status(201).json({ message: "Registration successful! Awaiting approval." });
    } catch (error) {
        console.error("DETAILED ERROR:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Email or License Number already registered." });
        }
        res.status(500).json({ error: "Database error." });
    }
}); // <--- This closing brace was originally in the wrong place!

// ==========================================
// SUPER ADMIN LOGIN
// ==========================================
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await prisma.superAdmin.findUnique({
            where: { username }
        });

        if (!admin) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        // Generate Token
        const token = jwt.sign(
            { id: admin.id, role: 'super_admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                username: admin.username,
                role: 'super_admin'
            }
        });

    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// HOSPITAL LOGIN
// ==========================================
router.post('/hospital/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the hospital by email
        const hospital = await prisma.hospital.findUnique({
            where: { email }
        });

        if (!hospital) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 2. Check if the hospital is approved
        if (hospital.status === 'pending') {
            return res.status(403).json({ 
                error: "Your account is still pending approval. Please wait for the Super Admin to verify your hospital." 
            });
        }

        if (hospital.status === 'suspended') {
            return res.status(403).json({ error: "This account has been suspended." });
        }

        // 3. Verify password
        const isMatch = await bcrypt.compare(password, hospital.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 4. Generate Token
        const token = jwt.sign(
            { id: hospital.id, role: 'hospital_admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 5. Send response
        res.json({
            message: "Login successful",
            token,
            hospital: {
                id: hospital.id,
                name: hospital.hospitalName,
                email: hospital.email,
                role: 'hospital_admin'
            }
        });

    } catch (error) {
        console.error("Hospital Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;