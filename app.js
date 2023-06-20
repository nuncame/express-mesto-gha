const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes/index");

const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("db connected");
  });

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "64905462259add9a1623e94a",
  };

  next();
});

app.get("/", (req, res) => {
  res.send("Hoorah");
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
