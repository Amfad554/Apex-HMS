// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Your Mongoose User Model

// 1. REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
    try {
        // Destructure exactly what the frontend is sending
        const { 
            email, 
            password, 
            firstName, 
            lastName, 
            gender, 
            dateOfBirth, 
            phone, 
            bloodGroup 
        } = req.body;

        // Validation: Ensure dateOfBirth exists before converting
        if (!dateOfBirth || isNaN(new Date(dateOfBirth).getTime())) {
            return res.status(400).json({ message: "A valid Date of Birth is required." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const vToken = crypto.randomBytes(32).toString('hex');

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verificationToken: vToken,
                isVerified: false,
                patientProfile: {
                    create: {
                        firstName: firstName || "", // Fallback to empty string if undefined
                        lastName: lastName || "",
                        gender: gender || "Other",
                        phone: phone || "",
                        bloodGroup: bloodGroup || "N/A",
                        dateOfBirth: new Date(dateOfBirth),
                    }
                }
            }
        });

        console.log(`Verification Link: http://localhost:3000/verify-email?token=${vToken}`);
        res.status(201).json({ message: "Registration successful! Please verify your email." });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
// 3. VERIFY ROUTE (Called by VerifyEmail.jsx)
app.get('/api/auth/verify', async (req, res) => {
    const { token } = req.query;

    try {
        // 1. Find user by token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        // 2. If no user found with that token, check if they are already verified
        if (!user) {
            // This handles the "Double Click" or "Strict Mode" issue
            return res.status(200).json({ message: "Account is already active. You can log in." });
        }

        // 3. Update user to verified and CLEAR the token
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                isVerified: true, 
                verificationToken: null // Cleared for security
            }
        });

        res.json({ message: "Account activated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during verification." });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 2. STOPS LOGIN IF NOT VERIFIED
    if (!user.isVerified) {
        return res.status(403).json({
            message: "Please verify your email before logging in.",
            needsVerification: true
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
});