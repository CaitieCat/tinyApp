const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { findUserEmail, findID, randomID, urlsOfUser } = require("./helpers");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['7f69fa85-caec-4d9c-acd7-eebdccb368d5', 'f13b4d38-41c4-46d3-9ef6-8836d03cd8eb'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", saltRounds)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", saltRounds)
  }
};

//render the /urls route to show all urls
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsOfUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id]
  };
  res.render("urls_index3", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = randomID();
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }
  res.redirect(`/urls/${newShortURL}`);
});

// Page to add a new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  if (req.session.user_id === undefined) {
    res.redirect("/login");
  } else {
    res.render("urls_new3", templateVars);
  }
});

//View the URL data
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    user: users[req.session.user_id]
  };
  if (req.session.user_id !== undefined){
    if (urlDatabase[req.params.shortURL]["userID"] === req.session.user_id){
      res.render("urls_show3", templateVars);
    } else {
      res.send("This url doesn't belong to you");
    }
  } else {
    res.send("Please log in first");
  }
});


//Redirect page to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});

//update URL
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.updatedURL;
  res.redirect(`/urls/${req.params.id}`);
});

//delete url
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//login
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const userToLogin = findID(req.body.email, users);
  if (req.body.email === '' || req.body.password === '') {
    res.sendStatus(403);
  } else if (findUserEmail(req.body.email, users) !== true) {
    res.sendStatus(403);
  } else {
    if (bcrypt.compareSync(req.body.password, users[userToLogin]["password"])) {
      req.session.user_id = userToLogin;
      res.redirect("/urls");
    } else {
      res.send("Bad password");
    }
  }
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/urls");
});

//registration info
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

//adds a new user after registering
app.post("/register", (req, res) => {
  const newUserID = randomID();
  if (req.body.email === '' || req.body.password === '') {
    res.sendStatus(400);
  } else if (findUserEmail(req.body.email, users) === true) {
    res.sendStatus(400);
  } else {
    users[newUserID] = {
      id: newUserID,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRounds)
    };
    req.session.user_id = newUserID;
    res.redirect("/urls");
  }
});

//Listen for requests on PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});