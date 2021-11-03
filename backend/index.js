require("./mongo");
require("dotenv").config();
const { getNonce, verifySign, logout } = require("./services/authService");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(express.json());
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));

var myLogger = function (req, res, next) {
  console.log("Date: ", Date.now());
  console.log("Request from: ", req.ip);
  console.log("EndPoint: ", req.url);
  console.log("Req Body: ", req.body);
  next();
};

app.use(myLogger);

app.post("/api/v1/getNonce", (req, res) => {
  const { address } = req.body;
  console.log(address)
  getNonce(address).then((r) => res.status(r.status).json(r));
});

app.post("/api/v1/login", (req, res) => {
  const { res: sign, nonce, msg } = req.body;
  verifySign(sign, nonce, msg).then((r) => res.status(r.status).json(r));
});

app.post("/api/v1/logout", (req, res) => {
  const { address } = req.body;
  logout( address ).then((r) => res.status(r.status).json(r));
});

app.all("*", (req, res) => {
  const resp = { status: 404, message: "Unauthorized" };
  res.status(404).json(resp);
});

app.listen(port||8000, () => {
  console.log(`Example app listening at port:${port}`);
});
