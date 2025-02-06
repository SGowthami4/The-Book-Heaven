import React from "react";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import {useNavigate} from 'react-router-dom';
import { Alert,AlertDescription } from "./components/ui/alert";
import { Card, CardDescription, CardFooter, CardTitle,CardHeader,CardContent } from "./components/ui/card";

function User() {
  const [message, setMessage] = useState("");
  const [userBooks,setUserBooks]=useState([])
  const navigate=useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3005/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }
        const data = await response.json();

        setUserBooks(data.rentedBooks);
      } catch (error) {
        setMessage("Error Fetching user data");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>User Page</h1>
      <div className="flex justify-end p-8">
        <Button onClick={()=>navigate('/userPage')}>Back</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-full gap-10">
      {userBooks? userBooks.map((book)=>(
          <Card key={[book.title,book.rental_date]} className="flex flex-col py-4 px-2 border-2 border-b-4 border-r-4 text-start  start">
          <CardHeader className="pl-4">
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>
              <p><strong>Author:</strong> {book.author}</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-4"> 
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Pages:</strong> {book.pages}</p>
            <p><strong>Language:</strong> {book.language}</p>
            <p><strong>Price:</strong> ₹ {book.price}</p>
            <p><strong>Copies Available:</strong> {book.no_of_copies_available}</p>
          </CardContent>
          <CardFooter className="pl-4">
          
              <strong>Rental Date:</strong> {new Date(book.rental_date).toLocaleDateString('en-US')}
           
          </CardFooter>
      </Card>      
      )) : (
     <div>
     <p>No books Rented</p>
     </div>
    )}
      </div>
    </div>
  );
}

export default User;
