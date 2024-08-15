const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
let books = require("./router/booksdb.js");

const JWT_SECRET = "your_jwt_secret";

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    token = req.session.authorization["accessToken"];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.get("/api/books", (req, res) => {
  const { author, title } = req.query;
  let result = Object.values(books);

  if (author) {
    result = result.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  if (title) {
    result = result.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  res.json(result);
});

app.get("/api/books/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.listen(PORT, () => console.log("Server is running at port :", PORT));
