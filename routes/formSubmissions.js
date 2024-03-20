// routes/formSubmissions.js

const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');

// Route to create a new form submission
router.post('/api/form-submissions', async (req, res) => {
  console.log(req.body);
  const { username, language, stdin, sourceCode } = req.body;
  try {
    const newFormSubmission = await FormSubmission.create({
      username,
      language,
      stdin,
      sourceCode
    });
    res.status(201).json(newFormSubmission);
  } catch (error) {
    console.error('Error creating form submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/form-submissions', async (req, res) => {
  try {
    const formSubmissions = await FormSubmission.findAll();
    res.json(formSubmissions);
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
