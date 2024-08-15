const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Simulating an API endpoint for our local books data
const API_URL = "http://localhost:5000/api";

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   try {
//     const bookList = JSON.stringify(books, null, 2);
//     res.status(200).json(JSON.parse(bookList));
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error retrieving books", error: error.message });
//   }
// });

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params.isbn;
//   if (books[isbn]) {
//     res.status(200).json(books[isbn]);
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }
// });

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author.toLowerCase();
//   const booksByAuthor = Object.values(books).filter(
//     (book) => book.author.toLowerCase() === author
//   );

//   if (booksByAuthor.length > 0) {
//     res.status(200).json(booksByAuthor);
//   } else {
//     res.status(404).json({ message: "No books found for this author" });
//   }
// });

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title.toLowerCase();
//   const booksByTitle = Object.values(books).filter((book) =>
//     book.title.toLowerCase().includes(title)
//   );

//   if (booksByTitle.length > 0) {
//     res.status(200).json(booksByTitle);
//   } else {
//     res.status(404).json({ message: "No books found with this title" });
//   }
// });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

// Task 10: Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${API_URL}/books/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.status(500).json({
        message: "Error retrieving book details",
        error: error.message,
      });
    }
  }
});

// Task 12: Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`${API_URL}/books`, {
      params: { author },
    });
    if (response.data.length > 0) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books by author",
      error: error.message,
    });
  }
});

// Task 13: Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`${API_URL}/books`, { params: { title } });
    if (response.data.length > 0) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books by title",
      error: error.message,
    });
  }
});

module.exports.general = public_users;
