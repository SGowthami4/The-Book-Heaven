import React from "react";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import {useNavigate} from 'react-router-dom';
import { Alert,AlertDescription } from "./components/ui/alert";
import { Card, CardDescription, CardFooter, CardTitle } from "./components/ui/card";

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
      <div>

      {userBooks? userBooks.map((book)=>(
        <Card key={book.title} >
          <CardTitle>

        Book Name:{book.title}
          </CardTitle>
          <CardDescription className="flex-col items-center justify-center"><p className="text-3xl">
          Book Author: {book.author}
          </p>
          <p className="text-2xl">Genre :{book.genre}</p>
          <p className="text-2xl">Pages: {book.pages}</p>
          <p className="text-2xl">Language :{book.language}</p>
          <p className="text-2xl">Available copies: {book.no_of_copies_available}</p>

            </CardDescription>
            <CardFooter className="flex-col items-center justify-center">
              <p className="text-2xl">
              Rented On:{
              book.rental_date}
              </p>
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
