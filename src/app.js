require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const { PORT = 8000 } = process.env;

const router = require("./routes");
const { CustomError, errorHandler } = require("./utils/errorHandler");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "Hello Welcome To Back-End Kelompok 4",
    });
  } catch (err) {
    next(err);
  }
});

app.use('/api/v1',router);

// 404 error handling
app.use((req, res, next) => {
  next(new CustomError(404, "Not Found"));
});

// 500 Internal Server Error
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`server running at http://localhost:${PORT}`)
);
