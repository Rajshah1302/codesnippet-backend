const express = require("express");
const router = express.Router();
const FormSubmission = require("../models/FormSubmission");
const axios = require("axios");
const { getLanguageId } = require("../utils/LanguageUtil");

// Set CORS headers for all routes
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow access from any origin
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"); // Allow specified HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specified headers
  next(); // Move to the next middleware
});

// Route to create a new form submission
router.post("/api/form-submissions", async (req, res) => {
  const { username, language, stdin, sourceCode } = req.body;
  let output;
  let newFormSubmission;

  try {
    newFormSubmission = await FormSubmission.create({
      username,
      language,
      stdin,
      sourceCode,
    });
    const language_id = getLanguageId(language);

    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        method: "POST",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          source_code: sourceCode,
          stdin: stdin,
          language_id: language_id,
        }),
      }
    );

    const jsonResponse = await response.json();
    let jsonGetSolution = {
      status: { description: "Queue" },
      stderr: null,
      compile_output: null,
    };
    while (
      jsonGetSolution.status.description !== "Accepted" &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;
        const getSolution = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            "content-type": "application/json",
          },
        });
        jsonGetSolution = await getSolution.json();
      }
    }
    if (jsonGetSolution.stdout) {
      output = atob(jsonGetSolution.stdout);
    } else if (jsonGetSolution.stderr) {
      output = atob(jsonGetSolution.stderr);
    } else {
      output = atob(jsonGetSolution.compile_output);
    }
  } catch (error) {
    console.error("Error processing form submission:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  try {
    await FormSubmission.update({ output }, { where: { id: newFormSubmission.id } });
    res.status(200).json({ message: "Form submission successful", submissionId: newFormSubmission.id });
  } catch (error) {
    console.error("Error updating form submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all form submissions
router.get("/api/form-submissions", async (req, res) => {
  try {
    const formSubmissions = await FormSubmission.findAll();
    res.json(formSubmissions);
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
