import express from "express";
import cors from "cors";
import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
  },
});

const User = mongoose.model("User", UserSchema);


const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({ accessToken: accessToken });
    if (user) {
      next();
    } else {
      res.status(401).json({
        response: "Please log in",
        success: false
      });
    }
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false
    });
  }
};

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("This is the backend of Project-auth by Naghmeh Okhovat and Antonella Cardozo.");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().limit(20).exec();
    res.status(200).json(users)
  } catch (error) {
    res.status(400).json({ message: "Could not create user" })
  }
});

app.get('/secrets', authenticateUser);
// app.get('/secrets', (req, res) => {
//   res.status(200).json({message:"This is a super secret message"})
// });
app.get('/secrets', async (req, res) => {
  const userSecret = await User.findOne({ accessToken: req.header('Authorization') })
  res.status(200).json({
    response: {
      message: `Unfortunely, this is a top secret! You cannot continue browsing here. ${userSecret}`
    },
    success: true
  })
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(); // Create a randomizer to prevent to unhash it
    const newUser = await new User({
      username,
      email,
      password: bcrypt.hashSync(password, salt)
    }).save();
    res.status(201).json({
      response: {
        userId: newUser._id,
        username: newUser.username,
        accessToken: newUser.accessToken
      },
      success: true
    });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ username, email });
    if (user && bcrypt.compareSync(password, user.password, email, user.email)) {
      res.status(200).json({
        response: {
          userId: user._id,
          username: user.username,
          email: user.email,
          accessToken: user.accessToken
        },
        success: true
      });
    } else {
      res.status(404).json({
        response: "Username, email or password doesn't match.",
        success: false
      });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
