// --- 1. GET DROPDOWN DATA ---
const { sendAppointmentEmail } = require('./mail');
app.get('/api/appointment-data/:hospitalId', async (req, res) => {
    try {
        // Safety: take only the part before a colon and turn to Integer
        const hospitalIdRaw = req.params.hospitalId.split(':')[0];
        const hospitalId = parseInt(hospitalIdRaw);

        if (isNaN(hospitalId)) {
            return res.status(400).json({ error: "Invalid ID format. Expected a number." });
        }

        const [doctors, patients] = await Promise.all([
            prisma.staff.findMany({
                where: { hospitalId, role: 'DOCTOR' },
                select: { id: true, firstName: true, lastName: true }
            }),
            prisma.patient.findMany({
                where: { hospitalId },
                select: { id: true, firstName: true, lastName: true, email: true }
            })
        ]);

        res.json({ doctors, patients });
    } catch (err) {
        console.error("PRISMA ERROR:", err); // Check your terminal for this log!
        res.status(500).json({ error: "Database query failed", details: err.message });
    }
});
// --- 2. GET ALL APPOINTMENTS (Admin View) ---
app.get('/api/appointments/:hospitalId', async (req, res) => {
    try {
        const hospitalId = parseInt(req.params.hospitalId);
        const apps = await prisma.appointment.findMany({
            where: { hospitalId },
            include: {
                patient: true,
                staff: { select: { lastName: true, specialization: true } }
            },
            orderBy: { scheduledAt: 'desc' }
        });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});

// --- 3. BOOK NEW APPOINTMENT ---

app.post('/api/appointments', async (req, res) => {
    try {
        const { hospitalId, patientId, staffId, date, time, type } = req.body;

        if (!hospitalId || !patientId || !staffId || !date || !time) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const scheduledAt = new Date(`${date}T${time}`);

        // OPTIONAL: Check if doctor is already busy at this exact time
        const existing = await prisma.appointment.findFirst({
            where: {
                staffId: staffId,
                scheduledAt: scheduledAt,
                status: { not: 'Canceled' } // Ignore canceled ones
            }
        });

        if (existing) {
            return res.status(409).json({ error: "Doctor already has an appointment at this time." });
        }

        const newAppointment = await prisma.appointment.create({
            data: {
                scheduledAt,
                hospitalId: parseInt(hospitalId),
                patientId: patientId,
                staffId: staffId,
                type: type || "General Visit",
                status: "Scheduled"
            },
            include: {
                patient: true,
                staff: { select: { firstName: true, lastName: true, specialization: true } }
            }
        });

        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("PRISMA ERROR:", error);
        res.status(500).json({ error: "Database error during booking" });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    try {
        // Fetch appointment first to get patient info before deleting
        const app = await prisma.appointment.findUnique({
            where: { id: req.params.id },
            include: { patient: true, staff: true }
        });

        if (app) {
            await prisma.appointment.delete({ where: { id: req.params.id } });

            // Send Cancellation Email
            if (app.patient.email) {
                await sendAppointmentEmail(
                    app.patient.email,
                    app.patient.firstName,
                    {
                        doctor: app.staff.lastName,
                        date: app.scheduledAt.toDateString(),
                        time: app.scheduledAt.toLocaleTimeString(),
                        type: app.type
                    },
                    'CANCELLED'
                );
            }
        }

        res.json({ message: "Deleted and patient notified." });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});