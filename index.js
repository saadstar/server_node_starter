const express = require("express");
const app = express();
const env = require("dotenv").config();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dbConnection = require("./config/connectDB");
const authRoute = require("./routes/auth");


const PORT = process.env.PORT || 3500 ;
dbConnection();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));


app.get("/api", (req, res) => {
    res.status(200).json("hello Here");
});

app.use("/api/auth/", authRoute);


app.listen(PORT, () => {
    console.log(`Server Running on PORT:${PORT}`);
})