const findUserEmail = function(email, userDB) {
  for (const each in userDB) {
    if (userDB[each]['email'] === email) {
      return true;
    }
  }
  return false;
};

const randomID = function() {
  let randomString = Math.random().toString(36).slice(2, 8);
  return randomString;
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
  };
  for (const each in urlDB) {
    if (userID === urlDB[each]["userID"]) {
      usersURLs[each] = urlDB[each];
    }
  }
  return usersURLs;
};

const getUserByEmail = function(email, database) {
  for (const each in database){
    if (database[each][email] === email){
      return database[each];
    }
  }
  return null;
};

module.exports = {findUserEmail, urlsOfUser, findID, randomID, getUserByEmail};