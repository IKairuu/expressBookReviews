const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  if (isValid(req.body["username"]))
  {
    users.push({"username": req.body["username"], "password": req.body["password"]}) ;
    return res.status(200).json({message: "Registered Successfully"});
  }
  else
  {
    return res.status(404).json({message: "username found"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const data = req.params.isbn ;
  return res.status(200).json(JSON.stringify(books[data]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const data = req.params.author ;
  let bookList = [] ;
  for (let objs in books)
  {
    if (books[objs].author == data)
    {
        bookList.push(books[objs]) ;
    }
  }
  if (bookList.length > 0)
    {return res.status(200).json({message: bookList});}
  else
    {return res.status(200).json({message: "None Found"});}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const data = req.params.title ;
  let bookList = [] ;
  for (let objs in books)
  {
    if (books[objs].title == data)
    {
        bookList.push(books[objs]) ;
    }
  }
  if (bookList.length > 0)
    {return res.status(200).json({message: bookList});}
  else
    {return res.status(200).json({message: "None Found"});}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const data = req.params.isbn ;
  return res.status(200).json(JSON.stringify(books[data].reviews));
});

module.exports.general = public_users;
