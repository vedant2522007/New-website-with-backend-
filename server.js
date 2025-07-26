const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbPath = path.join(__dirname, 'db.json');

const readDb = () => {
    if (!fs.existsSync(dbPath)) {
        return { events: [], members: [], contacts: [] };
    }
    const data = fs.readFileSync(dbPath);
    return JSON.parse(data);
};

const writeDb = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

app.get('/api/events', (req, res) => {
    const db = readDb();
    res.json(db.events);
});

app.post('/api/events', (req, res) => {
    const db = readDb();
    const newEvent = { id: Date.now(), ...req.body };
    db.events.push(newEvent);
    writeDb(db);
    res.status(201).json(newEvent);
});

app.delete('/api/events/:id', (req, res) => {
    const db = readDb();
    const eventId = parseInt(req.params.id);
    db.events = db.events.filter(event => event.id !== eventId);
    writeDb(db);
    res.status(204).send();
});

app.post('/api/membership', (req, res) => {
    const db = readDb();
    const newMember = { id: Date.now(), ...req.body };
    db.members.push(newMember);
    writeDb(db);
    console.log("New membership application:", newMember);
    res.status(201).json({ message: 'Application submitted successfully!' });
});

app.post('/api/contact', (req, res) => {
    const db = readDb();
    const newContact = { id: Date.now(), ...req.body };
    db.contacts.push(newContact);
    writeDb(db);
    console.log("New contact message:", newContact);
    res.status(201).json({ message: 'Message sent successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
