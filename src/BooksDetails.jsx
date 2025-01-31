import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "./components/ui/alert";
import { Button } from "./components/ui/button";

export default function BooksDetails() {
  const [books, setBooks] = useState([]);
  const [renterDetails, setRenterDetails] = useState({
    user_id: "",
    book_id: "",
    rented_book: "",
    rental_date: "",
    rental_status: false, 
    rental_quantity: 1,
  });
  const [rentedMessage, setRentedMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedBooks = async () => {
      try {
        const response = await fetch("http://localhost:3005/books", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data.books || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedBooks();
  }, []);

  const handleRentingBook = async () => {
    if(!renterDetails.user_id || !renterDetails.rental_date || !renterDetails.rental_quantity){
      setRentedMessage('All fields are required for renting');
      return;
        }
    try {
      // Fetch username for success message
      const userId = Number(renterDetails.user_id);
      const userResponse = await fetch(`http://localhost:3005/users/${userId}`, {
        method: "GET",
      });
      if (!userResponse.ok) {
        setRentedMessage("Invalid User ID or User not found.");
        return;
      }
      const userData = await userResponse.json();
      const username = userData.username;
      console.log(userData);
      
      // Send POST request to rent a book
      const response = await fetch("http://localhost:3005/rentingBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(renterDetails),
      });

      if (response.ok) {
        setRenterDetails({...renterDetails,rental_status:true})  
        setRentedMessage(`Success! ${username} has rented "${renterDetails.rented_book}".`);
      } else {
        setRentedMessage("Renting failed. Please try again.");
      }

      setTimeout(() => {
        setRentedMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error during renting process:", error);
      setRentedMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      {rentedMessage && <Alert>{rentedMessage}</Alert>}
      <div className="flex justify-end">
      <Button onClick={()=>navigate('/admin')}>Back</Button>
      </div>
      {books.length > 0 ? (
        <Table>
          <TableCaption>Books for rent</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Book Id</TableHead>
              <TableHead>Book Title</TableHead>
              <TableHead>Author Name</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Available copies</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.book_id}>
                <TableCell>{book.book_id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>{book.language}</TableCell>
                <TableCell>{book.no_of_copies_available}</TableCell>
                <TableCell>{book.price}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button>Rent</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Renting {book.title}</h4>
                          <p className="text-sm text-muted-foreground">Enter details</p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="user_id">UserId</Label>
                            <Input
                              id="user_id"
                              placeholder="Enter UserId"
                              value={renterDetails.user_id}
                              type="number"
                              onChange={(e) =>
                                setRenterDetails({ ...renterDetails,user_id: e.target.value })
                              }                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="book_id">Book ID</Label>
                            <Input
                              id="book_id"
                              value={renterDetails.book_id}
                              onChange={(e) =>
                                setRenterDetails({ ...renterDetails,book_id:e.target.value})
                              }                              className="col-span-2 h-8"
                             
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="rented_book">Book</Label>
                            <Input
                              id="rented_book"
                            value={renterDetails.rented_book}
                              onChange={(e) =>
                                setRenterDetails({ ...renterDetails,rented_book:e.target.value})
                              }                              className="col-span-2 h-8"
                             
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="rental_date">Rental Date</Label>
                            <Input
                              id="rental_date"
                              type="date"
                              value={renterDetails.rental_date}
                              onChange={(e) =>
                                setRenterDetails({ ...renterDetails,rental_date: e.target.value })
                              }                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="rental_quantity">Quantity</Label>
                            <Input
                              id="rental_quantity"
                              type="number"
                              value={renterDetails.rental_quantity}
                              onChange={(e) =>
                                setRenterDetails({ ...renterDetails,rental_quantity: e.target.value })
                              }                              className="col-span-2 h-8"
                              min="1"
                            />
                          </div>
                        </div>
                        <Button onClick={handleRentingBook}>Rent</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Alert>Loading...</Alert>
      )}
    </div>
  );
}
