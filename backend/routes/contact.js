import express from 'express';
import Contact from '../models/contactModel.js';

const router = express.Router();

// Create a new contact
router.post('/', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a contact
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        updatedData.updatedAt = Date.now();
        updatedData.edited = true;
        const updatedContact = await Contact.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a contact
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndDelete(id);
        res.status(200).json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
