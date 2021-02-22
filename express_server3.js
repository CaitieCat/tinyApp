const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const randomID = function() {
  let randomString = Math.random().toString(36).slice(2, 8);
  return randomString;
};

const findUserEmail = function(email, userDB) {
  for (const each in userDB) {
    if (userDB[each]['email'] === email) {
      return true;
    }
  }
  return false;
};

const findID = function(email, userDB) {
  for (const each in userDB) {
    if (userDB[each]['email'] === email) {
      return each;
    }
  }
  return null;
};

const urlsOfUser = function(userID, urlDB) {
  const usersURLs = {
  }
  for (const each in urlDB) {
    if (userID === urlDB[each]["userID"]){
      usersURLs[each] = urlDB[each];
    }
  }
  return usersURLs;
}


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
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

//render the /urls route to show all urls
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsOfUser(req.cookies["user_id"], urlDatabase),
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index3", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = randomID();
  urlDatabase[newShortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  }
  res.redirect(`/urls/${newShortURL}`);
});

// Page to add a new URL
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  if (req.cookies["user_id"] === undefined) {
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
    user: users[req.cookies["user_id"]]
  };
  if (req.cookies["user_id"] !== undefined){
    if (urlDatabase[req.params.shortURL]["userID"] === req.cookies["user_id"]){
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
    user: users[req.cookies["user_id"]]
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
    if (users[userToLogin]["password"] === req.body.password) {
      res.cookie("user_id", userToLogin);
      res.redirect("/urls");
    } else {
      res.send("Bad password");
    }
  }
});

//logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//registration info
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
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
      password: req.body.password
    };
    res.cookie("user_id", newUserID);
    res.redirect("/urls");
  }
});

//Listen for requests on PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});