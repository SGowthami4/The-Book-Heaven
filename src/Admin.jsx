import React,{useState,useEffect} from "react";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import {useNavigate,Link} from 'react-router-dom';
export default function Admin({ newUser, setNewUser }) {
  const [message, setMessage] = useState("");
  const navigate=useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3005/admin", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (response.status === 403){
          setMessage("You don't have access to admin page")
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }
        const data = await response.json();

        setMessage(data.message);
      } catch (error) {
        setMessage("Error Fetching user data");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
    <h1>Admin Page</h1>
    {!(message === 'Welcome to admin page') ? (
      <Alert>
      <AlertDescription>
        <p>{message || "Loading..."}</p>
      </AlertDescription>
      <Button onClick={() => navigate('/userPage')}>Back</Button>
    </Alert>   
    ) : (
     <div>
      <div className="flex justify-end">
      <Button onClick={() => navigate('/userPage')}>Back</Button>
      </div>
      <nav className="flex gap-3">
      <Link to="/usersInfo">
       UsersDetails
        </Link>|
        <Link to="/allBooksInfo">
        BooksDetails
        </Link> |
        <Link to="/rentedBooks">
        Rentedbooks
        </Link>
      </nav>
     </div>
    )}
  </div>
  
  );
}
