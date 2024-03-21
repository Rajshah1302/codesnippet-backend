const express = require("express");
const formSubmissionsRouter = require("./routes/formSubmissions");
const cors = require("cors"); // Import the cors middleware

const app = express();
app.use(cors());
app.use(express.json());

// Mount the formSubmissionsRouter on '/api/form-submissions'
app.use(formSubmissionsRouter);

// Set Access-Control-Allow-Origin header for the root route
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow access from any origin
  res.send("hi");
});

app.listen(6000, () => {
  console.log("Server is running on port 6000");
});
