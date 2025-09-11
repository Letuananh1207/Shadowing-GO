const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const User = require("./models/User");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const unitRoutes = require("./routes/unitRoutes");
const noteRoutes = require("./routes/noteRoutes");
const progressRoutes = require("./routes/progressRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

// Cho phép React frontend gọi API kèm cookie
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 🔹 Dùng express-session (MemoryStore dev mode)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      httpOnly: true,
      secure: false, // true nếu deploy HTTPS
    },
  })
);

// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Kiểm tra user có tồn tại chưa
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Nếu chưa → tạo mới
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0]?.value,
            photo: profile.photos[0]?.value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize / Deserialize user
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/progress", progressRoutes);

// Route login
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback sau khi Google xác thực
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173"); // Quay lại React app
  }
);

// API test user login
app.get("/api/current_user", (req, res) => {
  res.send(req.user || null);
});

module.exports = app;
