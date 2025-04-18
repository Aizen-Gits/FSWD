const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
const hbs = require("hbs");
const body_parser = require("body-parser");
const mongoose = require("mongoose");

// MongoDB connection
require("./db/conn");

// Mongoose model
const register = require("./models/register");

// Middleware
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

// Setting up Handlebars
const views_path = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", views_path);

// Register custom helper for dropdown selection
hbs.registerHelper("ifCond", function (v1, v2, options) {
  return v1 === v2 ? options.fn(this) : options.inverse(this);
});

// ✅ Root route
app.get("/", (req, res) => {
  res.redirect("/index");
});

// Index page route
app.get("/index", (req, res) => {
  res.render("index");
});

// Testing routes
app.get("/data", (req, res) => {
  res.send("I AM COMING FROM BACKEND !");
});

app.get("/geo", (req, res) => {
  res.send("THIS IS A MINOR CLASS");
});

app.get("/bca", (req, res) => {
  res.send("this is a full stack class");
});

// ✅ Save data from form (Registration)
app.post("/send", (req, res) => {
  const { name, roll, reg, email, event } = req.body;
  const save_data = new register({ name, roll, reg, email, event });

  save_data
    .save()
    .then(() => {
      console.log("✅ Data Saved to DB!");
      // Redirect to /display with status=3 (for registration alert)
      res.redirect("/display?status=3");
    })
    .catch((e) => {
      console.log(`❌ Error: ${e}`);
      res.status(500).send("Internal Server Error");
    });
});

// ✅ Display registered students
app.get("/display", async (req, res) => {
  try {
    const data = await register.find();
    const status = req.query.status; // Catch status from query
    res.render("display", { data, status });
  } catch (error) {
    console.error("❌ Failed to load data:", error);
    res.status(500).send("Error loading data.");
  }
});

// ✅ Update or Delete student data
app.post("/update", async (req, res) => {
  const { name, roll, reg, email, event, id, btn } = req.body;
  let status;

  try {
    if (btn === "UPDATE") {
      await register.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { name, roll, reg, email, event } }
      );
      status = 1;
    }

    if (btn === "DELETE") {
      await register.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
      status = 2;
    }

    const data = await register.find();
    res.render("display", { data, status });
  } catch (error) {
    console.error("❌ Update/Delete error:", error);
    res.status(500).send("Error updating/deleting record.");
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://127.0.0.1:${port}`);
});
