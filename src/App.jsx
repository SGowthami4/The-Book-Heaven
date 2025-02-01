import { useState } from "react";
import "./App.css";
import Login from "./Login";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button } from "./components/ui/button";
import Register from "./Register";
import User from "./User";
import Admin from "./Admin";
import UserPage from "./UserPage";
import Books from "./Books";
import BooksDetails from "./BooksDetails";
import UsersDetails from "./UsersDetails";
import RentedBooks from "./RentedBooks";

function App() {
  const [token, setToken] = useState("");
  const [newUser,setNewUser]=useState(false)
 

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register setNewUser={setNewUser}/>}/>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/userPage" element={<UserPage token={token} />} />
          <Route path="/admin" element={<Admin newUser={newUser} setNewUser={setNewUser} />  }></Route>
          <Route path="/user" element={<User/>}></Route>
          <Route path="/books" element={<Books/>}></Route>
          <Route path="/usersInfo" element={<UsersDetails newUser={newUser} setNewUser={setNewUser}/>}></Route>
          <Route path="/allBooksInfo" element={<BooksDetails/> }></Route>
          <Route path="/rentedBooks" element={<RentedBooks/>}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
