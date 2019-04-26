require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const passport = require("passport");

const mongoConnectURI = process.env.ENVIRONMENT === "dev" ? "mongodb://localhost/urban-parents" : 'mongodb://heroku_8h5bjwnz:viqjgetookvbbs9dftg56ilkpe@ds147566.mlab.com:47566/heroku_8h5bjwnz';

//initialization of mongodb conection
mongoose
    .connect(mongoConnectURI, { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    })
    .catch(err => {
        console.error("Error connecting to mongo", err);
    });

const app_name = require("./package.json").name;
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`);
//express server instance
const app = express();



// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(
    session({
        secret: "secret-key-all",
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(
    require("node-sass-middleware")({
        src: path.join(__dirname, "public"),
        dest: path.join(__dirname, "public"),
        sourceMap: true
    })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

hbs.registerHelper("ifUndefined", (value, options) => {
    if (arguments.length < 2) throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
    if (typeof value !== undefined) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index");
const details = require("./routes/details");
const auth = require("./routes/auth");
const api = require("./routes/api");
const ws = require("./routes/ws");

app.use("/", ws);
app.use("/", auth);
app.use("/", index);
app.use("/", details);
app.use("/", api);
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3001 })

wss.broadcast = data => {
  wss.clients.forEach(client => client.send(data))
}
wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
    wss.broadcast(message)
  })

})


module.exports = app;
