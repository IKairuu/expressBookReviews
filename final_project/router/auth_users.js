const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    if (users.some(objs => objs.username == username))
    {
        return false ;
    }
    else
    {
        return true ;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
for (const user of users)
{
    if (user.username == username && user.password == password)
    {
        return true ;
    }
}
return false ;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body["username"] ;
  let password = req.body["password"] ;
  if (authenticatedUser(username, password))
  {
    let token = jwt.sign({data:username}, "secret-key", {expiresIn: "1h"}) ;
    return res.status(200).json({message: "Logged In Successfull", "token": token}) ;
  }
  else
  {
    return res.status(200).json({message: "Invalid username or password"}) ;
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.data;
  
    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
  
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added/updated successfully", reviews: books[isbn].reviews});
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.data;
  
    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({message: "Review not found"});
    }
  
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully", reviews: books[isbn].reviews});
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
