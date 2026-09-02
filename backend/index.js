var cors = require(`cors`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const dotEnv = require("dotenv").config();

//create express app
const app = express();
app.use(cors());

//setup server port
const port = process.env.PORT || 3000;

//parse requrests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//parse requrests of content-type - application/json
app.use(bodyParser.json());

//checking db connection
const dbConnEstablish = require("./config/db.config");

// User Account API
const UserAccountAPI = require("./src/routes/user.accounts.route");
app.use("/api/v1/user-accounts", UserAccountAPI);

//define a root route
app.get(`/`, (req, res) => {
    res.send("Backend Development");
});

//listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})


