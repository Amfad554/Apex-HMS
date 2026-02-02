import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.post('/api/signup', async (req, res) => {
    console.log("Request received:", req.body);
    try {
        // Destructure confirmPassword out so it's not passed to Prisma
        const {
            email,
            password,
            confirmPassword, // We capture this here to ignore it
            firstName,
            lastName,
            gender,
            dateOfBirth,
            phone,
            bloodGroup
        } = req.body;

        // 1. Basic Backend Validation (Safety Net)
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user in Database
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: "PATIENT",
                patientProfile: {  // ← Changed to "patientProfile"
                    create: {
                        firstName,
                        lastName,
                        gender,
                        dateOfBirth: new Date(dateOfBirth),
                        phone,
                        bloodGroup,
                    }
                }
            },
            include: {
                patientProfile: true  // ← Changed to "patientProfile"
            }
        });
        res.status(201).json({
            message: "Registration Successful!",
            user: { email: newUser.email, id: newUser.id }
        });

    } catch (error) {
        console.error("Prisma Error:", error);

        // Handle unique constraint (P2002 is Prisma's code for unique field violation)
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "This email is already registered." });
        }

        res.status(500).json({ error: "Internal server error. Please try again." });
    }
});
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        res.json({
            userId: user.id,
            role: user.role.toLowerCase(), // ✅ ALWAYS send lowercase
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { patientProfile: true }
        });
        res.json({
            firstName: user.patientProfile.firstName,
            lastName: user.patientProfile.lastName,
            bloodGroup: user.patientProfile.bloodGroup,
            phone: user.patientProfile.phone
        });
    } catch (error) {
        res.status(500).json({ error: "Could not load profile" });
    }
});

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});