const { Pool } = require("pg");
// client is a module inside pg
const fs=require('fs');
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { log } = require("console");

const app = express();
app.use(express.json());
const PORT = 3005;

const JWT_SECRET = "bcd8672b887b43d2758983a367cfc873368f98a228f70ced3e";
const client = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jtd_new",
  password: "jtd@123",
  port: 5432,
});

app.use(cors());

// Books Table creation

// async function tables(){
// await client.connect()
// const book=await client.query("create table books(book_id SERIAL PRIMARY KEY,ISBN varchar(100),title varchar(100),author varchar(100),genre varchar(100),pages int,language varchar(100),no_of_copies_rented int,no_of_copies_available int,Total_copies int,price decimal);")
// console.log(book);
// await client.end()

// }
// tables()

// Admin Table
// async function usersInfo() {
//   await client.connect()
//   const user=await client.query('create table rentedDetails(S_No SERIAL PRIMARY KEY,user_id INT,book_id INT DEFAULT 0,rental_status boolean default null,rented_book varchar(200),rental_date date ,returned boolean,returned_date date,rental_quantity int,CONSTRAINT fk_userId FOREIGN KEY (user_id) REFERENCES users(user_id),CONSTRAINT fk_bookId FOREIGN KEY (book_id) REFERENCES books(book_id));')
//   console.log(user);
//   await client.end();
// }
// usersInfo();


//Entering books details into books table



// // // Read the JSON file
// fs.readFile('./booksInfo.json', 'utf8', (err, data) => {
//   if (err) {
//     console.error('Error reading the file:', err);
//     return;
//   }

//   // Parse the JSON data
//   const books = JSON.parse(data);
//   client.connect()

//   // Loop through each book and insert into the database
  

//   books.forEach((book) => {
//     client.query(`
//       INSERT INTO books (ISBN, title, author, genre, pages, language, no_of_copies_rented, no_of_copies_available, Total_copies,price)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10)
//     `,
//     [
//       book.ISBN,
//       book.title,
//       book.author,
//       book.genre,
//       book.pages,
//       book.language,
//       book.no_of_copies_rented,
//       book.no_of_copies_available,
//       book.Total_copies,
//       book.price,
//     ]);
//   //  client.end()
   
//   });
// });

// create table renteddetails(
//   s_no SERIAL PRIMARY KEY,
//   user_id int,
//   book_id int,
//   rental_status boolean,
//   rented_book varchar(200),
//   rental_date varchar(100),
//   returned boolean,
//   returned_date varchar(100),
//   rental_quantity int
//   );
