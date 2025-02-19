require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const authMiddleware = require("./middleware/auth.middleware");
const { PORT = 8000 } = process.env;

const app = express();

const router = require("./routes");
const { CustomError, errorHandler } = require("./utils/errorHandler");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply auth middleware to all protected routes
app.use('/api/protected', authMiddleware);

// Load all routes
app.use('/api', routes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hello Welcome To Back-End Kelompok 4",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});
// 404 error handling
app.use((req, res, next) => {
  next(new CustomError(404, "Not Found"));
});
// 500 Internal Server Error
app.use(errorHandler);

app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);
