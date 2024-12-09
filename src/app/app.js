require('dotenv').config()
const express = require("express");
const cors = require("cors");
const buildApp = async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/uploads', express.static('uploads'));// Link uploads folder available via static route
    console.log("DIRNAME " + __dirname);
    app.get("/", (req, res) => {
        res.send("Succeed server is ready")
    })
    return app;
}

module.exports = buildApp;