const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const mongoose = require("mongoose");
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/users", {
  useNewUrlParser: true
});

// Le modele
const User = mongoose.model("User", {
  name: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  amount: {
    type: Number
  }
});

const users = [];

// **Create**
// 1 - Création de la route qui alimente la base de donnée
app.post("/create", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount
    });
    await newUser.save();
    res.json({ message: "Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  users.push(newUser);
  console.log(req.body);
});

// **Read** 2 - Création de la route qui renvoie les éléments
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/update", async (req, res) => {
  try {
    if (req.body.id && req.body.name) {
      const user = await User.findOne({ _id: req.body.id });

      user.name = req.body.name;
      await user.save();
      res.json({ message: "Updated" });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
