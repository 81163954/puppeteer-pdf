const express = require("express");
const cors = require("cors");
const { pdfResume } = require("./pdfResume");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:80",
      "http://app.pyroxcv.cn",
    ],
  })
);
app.use(express.json());

const PORT = process.env.PORT || 9999;

app.post("/pdf/:id", (req, res) => {
  pdfResume(req, res);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
