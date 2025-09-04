// index.js
const express = require("express");
const app = express();

// Định nghĩa cổng
const PORT = 3000;

// Định nghĩa route cơ bản
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

// Lắng nghe cổng
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
