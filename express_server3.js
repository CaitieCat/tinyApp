const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const randomID = function generateRandomString() {
  let randomString = Math.random().toString(36).slice(2, 8);
  return randomString;
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//render the /urls route to show all urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index3", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = randomID();
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
});

// Page to add a new URL
app.get("/urls/new", (req, res) => {
  res.render("urls_new3");
});

//View the URL data
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show3", templateVars);
});

//Redirect page to longURL
app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  });

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//Listen for requests on PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});