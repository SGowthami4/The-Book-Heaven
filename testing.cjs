const { Pool } = require("pg");
// client is a module inside pg
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
// app.use(
//   cors({
//     origin: "https://example.com",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-type", "Authorization"],
//     credentials: true,
//   })
// );


//MiddleWare
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role != requiredRole) {
      return res
        .status(403)
        .json({ message: "Access forbidden: Insufficient permissions" });
    }

    next();
  };
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);  
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

app.post("/register", async (req, res) => {
  const {username,password,email,role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10-tells how many times the hashing algorithm is performed.
    console.log("hashed password is", hashedPassword);

    await client.connect();
    const user = await client.query(
      "INSERT INTO users (username,password,email,role) VALUES ($1,$2,$3,$4)",
      [username, hashedPassword,email,role]
    );
    console.log(user);

    res.status(201).json({ message: "user registered" });
  } catch (error) {
    console.log(error);
  }
  // finally {
  //   client.end();
  // }
});
let role;
app.post("/login", async (req, res) => {
  const { username, password} = req.body;
  try {
    // await client.connect();
    const result = await client.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "user doesn't exist" });
    }
    user = result.rows[0];
    // console.log("Retrieved user:", user);
    // console.log("Hashed password:", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    console.log(user);
    // let role=user.role;
    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    
    res.json({ token,role:user.role});
    console.log({token,role:user.role});
    
  } catch (error) {
    console.log("error", error);
  }
  //  finally {
  //   client.end();
  // }
});
app.get('/userPage',(req,res)=>{
  
  res.json({"message":"Welcome!"})
})
app.get('/getAllUsers',authenticateToken,authorizeRole('Admin'),async(req,res)=>{
  try{
    const fetchingUsers=await client.query('select * from users;')
    res.status(200).json({allUsers:fetchingUsers.rows})
  }catch(err){
    console.error("Error executing query", err.stack)
  }finally{
    // await client.end
  }
})
app.get('/books',authenticateToken,async(req,res)=>{
  try{
    // await client.connect();
    const retrievedBooks=await client.query('select * from books limit 8;')
    res.status(200).json({"books":retrievedBooks.rows})
  }catch(err){
    console.error("Error executing query", err.stack)
  }finally{
    // await client.end();
  }
})
app.get("/user", authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to admin page' });
});
app.get("/admin", authenticateToken,authorizeRole("Admin"), (req, res) => {
  let adminId=req.user.userId;
  res.json({ message:'Welcome to admin page'});

});
app.post("/rentingBook", async (req, res) => {
  const { user_id, book_id, rented_book, rental_date, rental_status, rental_quantity } = req.body;
  
  // Ensure required fields are provided
  if (!user_id || !book_id || !rented_book || !rental_date || !rental_quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }  try {
   const rentDetails=await client.query(
      "INSERT INTO renteddetails(user_id, book_id, rented_book, rental_date, rental_status, rental_quantity) VALUES ($1, $2, $3, $4, $5, $6)",
      [user_id, book_id, rented_book, rental_date, rental_status, rental_quantity]
    );
    console.log(rentDetails);

    res.status(201).json({ message: "rented successfully" });
  } catch (error) {
    console.log(error);
  }
  // finally {
  //   client.end();
  // }
});
app.get('/users/:user_id', async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id); 
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    await client.connect();
    const result = await client.query(`SELECT * FROM users WHERE user_id=$1;`, [userId]); 
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get('/rentedDetails',async(req,res)=>{
  try{
    // await client.connect();
    const rentedBooks=await client.query('select users.user_id,users.username,renteddetails.s_no,renteddetails.book_id,renteddetails.rented_book,renteddetails.rental_date,renteddetails.returned,renteddetails.returned_date,renteddetails.rental_quantity from users Inner join renteddetails on renteddetails.user_id=users.user_id;')
    res.status(200).json({"rentedBooks":rentedBooks.rows})
  }catch(err){
    console.error("Error executing query", err.stack)
  }finally{
    // await client.end();
  }
})
app.put('/rentedDetails/:user_id',async(req,res)=>{
  const changedValues=req.body;
  try{
    const { s_no, ...rest } = changedValues;
    Object.entries(rest).forEach(([key, value]) => {
      const changingValues=client.query(`Update renteddetails set ${key}=${value} where s_no=${s_no};`)
    });
        res.status(200).json({"rentedBooks":rentedBooks.rows})

  }catch(err){
    console.error("Error executing query", err.stack)
  }finally{
    // await client.end();
  }
  
})
app.listen(PORT, () => {
  console.log("Server is running");
}); 

