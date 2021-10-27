// express
const express = require('express');
const morgan = require("morgan");
const cors = require("cors");

// conf
const config = require("config");

const MONGO_CONNECTION_STRING = config.get("db").get("url");
const routes = require('./routes')

const app = express()
const PORT = 3000

const mongoose = require("mongoose");

app.use(morgan("dev"));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/api', routes)

mongoose
  .connect(MONGO_CONNECTION_STRING)
  .then(() => app.listen(PORT, () => console.log("server started on ", PORT)))
  .catch(err => console.log(err));
