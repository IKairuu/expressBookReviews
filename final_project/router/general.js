const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (!isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({message: "Registered Successfully"});
  } else {
    return res.status(404).json({message: "Username already exists"});
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((data) => { return res.status(200).json(JSON.stringify(data)); })
  .catch((err) => { return res.status(500).json({message: "Error"}); });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios.get('http://localhost:5000/')
    .then((response) => {
      const allBooks = response.data;
      const book = allBooks[isbn];

      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({message: "Book not found"});
      }
    })
    .catch((err) => {
      return res.status(500).json({message: `Error: ${err.message}`});
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  axios.get('http://localhost:5000/')
    .then((response) => {
      const allBooks = response.data;
      const bookList = Object.values(allBooks).filter(book => book.author === author);

      if (bookList.length > 0) {
        return res.status(200).json(bookList);
      } else {
        return res.status(404).json({message: "No books found for this author"});
      }
    })
    .catch((err) => {
      return res.status(500).json({message: `Error: ${err.message}`});
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  axios.get('http://localhost:5000/')
    .then((response) => {
      const allBooks = response.data;
      const bookList = Object.values(allBooks).filter(book => book.title === title);

      if (bookList.length > 0) {
        return res.status(200).json(bookList);
      } else {
        return res.status(404).json({message: "No books found for this title"});
      }
    })
    .catch((err) => {
      return res.status(500).json({message: `Error: ${err.message}`});
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;