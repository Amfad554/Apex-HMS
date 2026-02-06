import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from './lib/prisma.js';
import nodemailer from 'nodemailer';

// --- ES MODULE COMPATIBLE IMPORTS FOR CLOUDINARY ---
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- CONFIGURE CLOUDINARY ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'apex_hms_profiles',
//         allowed_formats: ['jpg', 'png', 'jpeg'],
//     },
// });

// Temporary Disk Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure you create an 'uploads' folder!
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Changed from 465 to 587
    secure: false, // Must be false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- ROUTES ---

// 1. Hospital Registration with Image Upload
app.post('/api/auth/register', upload.single('profileImage'), async (req, res) => {
    const { hospitalName, email, password, phone, address } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const vToken = crypto.randomBytes(32).toString('hex');

        // ✅ 1. CREATE USER FIRST
        const newUser = await prisma.user.create({
            data: {
                hospitalName,
                email,
                password: hashedPassword,
                phone,
                address,
                verificationToken: vToken,
                isVerified: false,
            }
        });

        console.log("TOKEN SAVED:", newUser.verificationToken);

        // ✅ 2. SEND EMAIL AFTER USER EXISTS
        const verificationUrl = `http://localhost:5173/verify-email?token=${vToken}`;

        await transporter.sendMail({
            from: `"ApexHMS Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify Your Hospital Account",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
            <h2 style="color: #4338ca; text-align: center;">Welcome to ApexHMS</h2>
            <p style="font-size: 16px; color: #374151;">Thank you for registering your facility. To finalize your account and access your dashboard, please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #4338ca; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                   Verify Email Address
                </a>
            </div>
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <span style="color: #4338ca;">${verificationUrl}</span>
            </p>
            <hr style="border: 0; border-top: 1px solid #e1e1e1; margin-top: 20px;">
            <p style="font-size: 10px; color: #9ca3af; text-align: center; text-transform: uppercase;">AMT Hospital Systems</p>
        </div>
    `
        });

        res.status(201).json({ message: "Registration successful! Check your email." });

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
});

// 2. Email Verification
app.get("/api/auth/verify-email", async (req, res) => {
    const { token } = req.query;

    try {
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token
            }
        });

        if (!user) {
            // Check if user exists but is already verified
            const verifiedUser = await prisma.user.findFirst({
                where: {
                    verificationToken: null,
                    isVerified: true
                }
            });
            
            // This is a bit tricky - we can't know for sure if THIS token was used,
            // but we can give a helpful message
            return res.status(400).json({ 
                message: "This verification link has expired or has already been used. If your account is already verified, please try logging in." 
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null
            }
        });

        res.json({ message: "Email verified successfully! You can now log in." });

    } catch (err) {
        console.error("VERIFY ERROR:", err);
        res.status(500).json({ message: "Verification failed" });
    }
});

// 3. Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email first." });
        }
        res.json({ id: user.id, role: user.role.toLowerCase(), hospitalName: user.hospitalName });
    } catch (error) {
        res.status(500).json({ message: "Login error." });
    }
});

// 4. Staff Management
// --- NEW: Update Staff Member ---
// 4. Staff Management

// CREATE Staff
app.post('/api/staff', async (req, res) => {
    try {
        const { hospitalId, email, password, firstName, lastName, role, department, specialization } = req.body;

        // Safety check for ID types (handles both CUID strings and Auto-increment ints)
        const hId = isNaN(hospitalId) ? hospitalId : parseInt(hospitalId);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = await prisma.staff.create({
            data: {
                hospitalId: hId,
                email,
                password: hashedPassword,
                role,
                firstName,
                lastName,
                department,
                specialization
            }
        });
        res.status(201).json(newStaff);
    } catch (error) {
        console.error("POST STAFF ERROR:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: "A staff member with this email already exists." });
        }
        res.status(500).json({ message: "Failed to add staff member" });
    }
});

// FETCH Staff (Active only)
app.get('/api/staff/:hospitalId', async (req, res) => {
    try {
        const hId = isNaN(req.params.hospitalId) ? req.params.hospitalId : parseInt(req.params.hospitalId);
        const staff = await prisma.staff.findMany({
            where: {
                hospitalId: hId,
                isActive: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: "Error fetching staff" });
    }
});

// UPDATE Staff
app.put('/api/staff/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, role, department, email } = req.body;

        const updatedStaff = await prisma.staff.update({
            where: { id: id },
            data: { firstName, lastName, role, department, email }
        });

        res.json(updatedStaff);
    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({ message: "Failed to update staff member." });
    }
});

// DELETE (Deactivate) Staff
// Change this in server.js
app.delete('/api/staff/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Use .delete to physically remove the row
        await prisma.staff.delete({
            where: { id: id }
        });

        res.status(204).send();
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ message: "Failed to delete staff member." });
    }
});

// 5. Patient Management
// 5. Patient Management
app.post('/api/patients', async (req, res) => {
    try {
        // De-structure the new fields from the request body
        const {
            firstName, lastName, gender, dateOfBirth,
            bloodGroup, phone, hospitalId,
            allergies, medicalHistory // <--- Add these
        } = req.body;

        const newPatient = await prisma.patient.create({
            data: {
                firstName,
                lastName,
                gender,
                dateOfBirth: new Date(dateOfBirth),
                bloodGroup,
                phone,
                allergies: allergies || "",           // Store as empty string if null
                medicalHistory: medicalHistory || "", // Store as empty string if null
                hospitalId: parseInt(hospitalId)
            }
        });

        res.status(201).json(newPatient);
    } catch (error) {
        console.error("PATIENT REGISTRATION ERROR:", error);
        res.status(500).json({
            message: "Failed to register patient",
            error: error.message
        });
    }
});
app.get('/api/patients/:hospitalId', async (req, res) => {
    try {
        const patients = await prisma.patient.findMany({
            where: { hospitalId: parseInt(req.params.hospitalId) },
            orderBy: { createdAt: 'desc' }
        });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients" });
    }
});

// 6. Appointments
app.get('/api/appointment-data/:hospitalId', async (req, res) => {
    const { hospitalId } = req.params;
    const doctors = await prisma.staff.findMany({
        where: { hospitalId: parseInt(hospitalId), role: 'DOCTOR', isActive: true }
    });
    const patients = await prisma.patient.findMany({
        where: { hospitalId: parseInt(hospitalId) }
    });
    res.json({ doctors, patients });
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { patientId, staffId, date, time, hospitalId } = req.body;
        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                staffId,
                scheduledAt: new Date(`${date}T${time}`),
                status: 'PENDING',
                hospitalId: parseInt(hospitalId)
            },
            include: { patient: true, staff: true }
        });
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ error: "Booking failed" });
    }
});

app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));