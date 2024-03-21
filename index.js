const express = require("express");
const formSubmissionsRouter = require("./routes/formSubmissions");
const cors = require("cors"); // Import the cors middleware

const app = express();
app.use(
  cors({
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());

// Mount the formSubmissionsRouter on '/api/form-submissions'
app.use(formSubmissionsRouter);

app.listen(5000, () => {
  console.log("Server is running on port 3000");
});

app.get('/', (req, res) => {
  res.send('hi');
});