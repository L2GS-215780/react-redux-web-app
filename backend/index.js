var cors = require(`cors`);
const express = require(`express`);
const bodyParser = require(`body-parser`);
const cookieParser = require("cookie-parser");
const dotEnv = require("dotenv").config();

//create express app
const app = express();
app.use(cors());
app.use(cookieParser());

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
// Message Board API
const MessageBoardAPI = require("./src/routes/message.board.route");
app.use("/api/v1/message-boards", MessageBoardAPI);

//define a root route
app.get(`/`, (req, res) => {
    res.send("Backend Development");
});

//listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})


