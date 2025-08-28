require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const connectDB = require("./config/db");
const configureCloudinary = require("./config/cloudinary");
const { secret } = require("./config/secret");
const PORT = secret.port || 3000;
const morgan = require('morgan')
// error handler
const globalErrorHandler = require("./middleware/global-error-handler");
// routes

const indexRouter = require('./routes/index')
const userRoutes = require('./routes/user.routes');
const documentRoutes = require('./routes/documentRoutes');
// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// connect database
connectDB();

// configure cloudinary
configureCloudinary();

// API routes
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);



// root route
app.get("/", (req, res) => res.send("Apps worked successfully"));
app.use('/api', indexRouter)
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// global error handler
app.use(globalErrorHandler);
//* handle not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

module.exports = app;
