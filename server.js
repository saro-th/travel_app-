const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
let latestAIReport = "Waiting for AI to finish analysis...";

// n8n URL - Use /webhook/ for production, /webhook-test/ for active editing
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/travel-app';

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public')); 

mongoose.connect('mongodb://127.0.0.1:27017/wanderDB')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Error:', err));

const bookingSchema = new mongoose.Schema({
    input_type: String,
    email: String,
    reportData: String,
    date: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// Helper function to call n8n
async function callN8N(payload) {
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    
    const responseText = await n8nResponse.text();
    let aiOutput = "";

    try {
        const result = JSON.parse(responseText);
        aiOutput = result.text || result.output || result.data || (Array.isArray(result) ? result[0].text : null) || responseText;
    } catch (e) {
        aiOutput = responseText;
    }
    return aiOutput;
}

/**
 * 1. TEXT ENTRY
 */
app.post('/api/save-journey', async (req, res) => {
    try {
        const { email } = req.body;
        latestAIReport = "Wander AI is compiling your report...";
        
        // We pass the email to n8n so it can send it back in the callback
        const aiOutput = await callN8N({ ...req.body, input_type: "Text" });
        
        latestAIReport = aiOutput;
        await new Booking({ input_type: "Text", email: email, reportData: aiOutput }).save();
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error" });
    }
});

/**
 * 2. PHOTO UPLOAD
 */
app.post('/api/upload-ticket', async (req, res) => {
    try {
        const { ticket, email } = req.body;
        latestAIReport = "Scanning ticket with Gemini AI...";
        
        const aiOutput = await callN8N({ input_type: "Photo", email, image_base64: ticket });

        latestAIReport = aiOutput;
        await new Booking({ input_type: "Photo", email: email, reportData: aiOutput }).save();
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error" });
    }
});

/**
 * 3. DASHBOARD FETCH (Filtered by Email)
 */
app.get('/api/get-journeys', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) return res.status(400).json([]);
        
        // ONLY find bookings belonging to this specific user
        const history = await Booking.find({ email: email }).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json([]);
    }
});

/**
 * 4. CALLBACK ROUTE (Used by n8n HTTP Request Node)
 */
app.post('/api/n8n-callback', async (req, res) => {
    try {
        const { report, email } = req.body;
        console.log(`📩 Received private report for: ${email}`);

        latestAIReport = report;

        // Save with the specific user's email
        const newBooking = new Booking({
            input_type: "AI_Push",
            email: email || "guest@example.com", 
            reportData: report
        });
        await newBooking.save();

        res.status(200).send("Server Updated");
    } catch (error) {
        console.error("Callback Error:", error);
        res.status(500).send("Error");
    }
});

app.get('/api/get-report', (req, res) => res.send(latestAIReport));

const PORT = 3004;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
