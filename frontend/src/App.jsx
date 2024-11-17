import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import './App.css'
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL; // Backend API URL

const App = () => {
  console.log(API_URL);
  return (
    <Router>
      {/* Navigation Bar */}
      <AppBar position="static" className='nav-bar'>

        <Toolbar>
          <Typography variant="h4" component="div" style={{ flexGrow: 1 }}>
            Contact Management Feature
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/contacts">
            View Saved Contacts
          </Button>
        </Toolbar>
      </AppBar>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<ContactForm />} />
        <Route path="/contacts" element={<ContactList />} />
      </Routes>
    </Router>
  );
};

const ContactForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: '',
  });
  const [editId, setEditId] = useState(null);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        company: '',
        jobTitle: '',
      });
    } catch (error) {
      console.error('Error submitting contact:', error);
    }
  };

  return (
    <Container className='container'>
      <Typography variant="h4" gutterBottom>
        Add a Contact
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="firstName"
          label="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="lastName"
          label="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="company"
          label="Company"
          value={form.company}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="jobTitle"
          label="Job Title"
          value={form.jobTitle}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          {editId ? 'Update Contact' : 'Add Contact'}
        </Button>
      </form>
    </Container>
  );
};

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: '',
  });
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_URL);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      setDeleteId(null);
      setShowDeleteDialog(false);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Open update dialog
  const openUpdateDialog = (contact) => {
    setEditForm(contact);
    setEditId(contact._id);
    setShowUpdateDialog(true);
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, editForm);
      setShowUpdateDialog(false);
      setEditId(null);
      fetchContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  return (
    <Container className='container-2'>
      <Typography variant="h4" gutterBottom>
        All Contacts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Edited</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.firstName}</TableCell>
                <TableCell>{contact.lastName}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phoneNumber}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.jobTitle}</TableCell>
                <TableCell>
                  {contact.edited ? (
                    <div>
                      Yes
                      <Tooltip title={`Updated on: ${new Date(contact.updatedAt).toLocaleString()}`}>
                        <InfoIcon style={{ cursor: 'pointer', fontSize: 17 }} />
                      </Tooltip>
                    </div>
                  ) : (
                    "No"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => openUpdateDialog(contact)}
                  >
                    Update
                  </Button>
                  <Button
                    startIcon={<Delete />}
                    onClick={() => {
                      setDeleteId(contact._id);
                      setShowDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this contact?</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="primary">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Contact Dialog */}
      <Dialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
      >
        <DialogTitle>Update Contact</DialogTitle>
        <DialogContent>
          <TextField
            name="firstName"
            label="First Name"
            value={editForm.firstName}
            onChange={(e) =>
              setEditForm({ ...editForm, firstName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={editForm.lastName}
            onChange={(e) =>
              setEditForm({ ...editForm, lastName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            name="email"
            label="Email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            value={editForm.phoneNumber}
            onChange={(e) =>
              setEditForm({ ...editForm, phoneNumber: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            name="company"
            label="Company"
            value={editForm.company}
            onChange={(e) =>
              setEditForm({ ...editForm, company: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            name="jobTitle"
            label="Job Title"
            value={editForm.jobTitle}
            onChange={(e) =>
              setEditForm({ ...editForm, jobTitle: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">
            Update Contact
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
