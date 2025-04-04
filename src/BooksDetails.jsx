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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "./components/ui/alert";
import { Select,SelectTrigger,SelectLabel,SelectValue,SelectContent,SelectGroup,SelectItem } from "./components/ui/select";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function BooksDetails() {
  const [books, setBooks] = useState([]);
  const [addBook,setAddBook]=useState({
    title:'',
    author:'',
    genre:'',
    pages:'',
    language:'',
    no_of_copies_available:'',
    total_copies:'',
    price:''
  })
  const [editBook,setEditBook]=useState({
    title:'',
    author:'',
    genre:'',
    pages:'',
    language:'',
    no_of_copies_available:'',
    total_copies:'',
    price:''
  })
  const [renterDetails, setRenterDetails] = useState({
    user_id: "",
    book_id: "",
    rented_book: "",
    rental_date: "",
    rental_status: false, 
    rental_quantity: 1,
  });
  const [deleteBook,setDeleteBook]=useState({
    book_id:'',
    title:''
  })
  const [rentedMessage, setRentedMessage] = useState("");
  const [addBookMessage,setAddBookMessage]=useState('');
  const [editBookMessage,setEditBookMessage]=useState('');
  const [changedBookState,setChangedBookState]=useState(false)
  const [deletedBook,setDeletedBook]=useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedBooks = async () => {
      try {
        const response = await fetch("https://the-book-heaven-2lp4.onrender.com/books", {
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
  }, [changedBookState,deletedBook]);


  const handleRentingBook = async (book) => {
    if(!renterDetails.user_id ){
      setRentedMessage('All fields are required for renting');
      return;
        }
    if(book.no_of_copies_available<1){
      setRentedMessage('Unavailable');
      return;
    }
    try {
      // Fetch username for success message
      const userId = Number(renterDetails.user_id);
      const userResponse = await fetch(`https://the-book-heaven-2lp4.onrender.com/users/${userId}`, {
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
      const response = await fetch("https://the-book-heaven-2lp4.onrender.com/rentingBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(renterDetails),
      });

      if (response.ok) {
        setRenterDetails({...renterDetails,rental_status:true})  
        alert(`Success! ${username} has rented "${renterDetails.title}".`)
        setRentedMessage(`Success! ${username} has rented "${renterDetails.title}".`);
      } else {
        setRentedMessage("Renting failed. Please try again.");
      }

      setTimeout(() => {
        setRentedMessage("");
        setAddBookMessage('')
        setEditBookMessage('')
      }, 5000);
    } catch (error) {
      console.error("Error during renting process:", error);
      setRentedMessage("An error occurred. Please try again.");
    }
  };
   const handleAddBook=async()=>{
    if(!addBook.title || !addBook.author || !addBook.genre || !addBook.language || !addBook.no_of_copies_available || !addBook.pages || !addBook.price || !addBook.total_copies){
      setAddBookMessage('Enter all the required fields')
      return;
    }
    try{
      const response = await fetch("https://the-book-heaven-2lp4.onrender.com/addBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addBook),
      });

      if (response.ok) {
       alert(`${addBook.title} added successfully to bookslist.`)
        setChangedBookState(!changedBookState)
      } else {
        setRentedMessage("Failed to add book. Please try again.");
      }
    }catch (error) {
      console.error("Error while adding book", error);
      setRentedMessage("An error occurred. Please try again.");
    }

   }

   const handleEditClick = (book) => {
    setEditBook(book); 
  };
   const handleSaveEdits = async (book) => {
    if (!editBook.title || !editBook.author || !editBook.genre || !editBook.pages || !editBook.language || !editBook.no_of_copies_available|| !editBook.total_copies || !editBook.price) {
      setEditBookMessage('All fields are required.');
      return;
    }
  
    try {
      const response = await fetch(`https://the-book-heaven-2lp4.onrender.com/editBook/${book.book_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(editBook),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update book details");
      }
  
      setBooks((prev) =>
        prev.map((item) => (item.book_id === book.book_id ? { ...item, ...editBook } : item))
      );
  
      setEditBook({});
      alert(`Edited details of ${book.title} successfully!`);
    } catch (error) {
      console.error("Error updating details:", error);
    }
  };
  
   const handleDeleteBook= async(book)=>{
    try {
      const response = await fetch(`https://the-book-heaven-2lp4.onrender.com/delete/${book.book_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(deleteBook),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete`);
      }
      alert(`${book.title} book deleting successfully!`);
      setDeletedBook(!deletedBook)
    } catch (error) {
      console.error("Error deleting book:", error);
    }
   }

  return (
    <div>
       <div className="flex justify-center">
      <h1 className='font-medium m-4 text-4xl'>Books Details</h1>
      </div>
      {rentedMessage && <Alert className='font-semibold text-xl'>{rentedMessage}</Alert>}
      {editBookMessage && <Alert className='font-semibold text-xl'>{editBookMessage}</Alert>}
      <div className="flex gap-3 justify-between m-4">
      <Dialog>
      <DialogTrigger asChild>
        <Button  >Add a book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Book</DialogTitle>
          <DialogDescription>
            Enter book details 
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="book_title" className="text-right">
             Book Name
            </Label>
            <Input id="book_title" 
             value={addBook.title}
             onChange={(e) =>
               setAddBook({ ...addBook, title: e.target.value })
             }
            className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Author
            </Label>
            <Input id="author" 
            value={addBook.author}
            onChange={(e) =>
              setAddBook({ ...addBook, author: e.target.value })
            }
             className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genre" className="text-right">
              Genre
            </Label>
            <Select id='genre' 
            value={addBook.genre}
                  onValueChange={(value) => (
                    setAddBook({ ...addBook, genre: value })
                  )}>
            <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                      <SelectItem value="Dystopian">Dystopian</SelectItem>
                      <SelectItem value="Fiction">Fiction</SelectItem>
                      <SelectItem value="Mystery">Mystery</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Romance">Romance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pages" className="text-right">
              Pages
            </Label>
            <Input id="pages" 
             value={addBook.pages}
             onChange={(e) =>
               setAddBook({ ...addBook, pages: e.target.value })
             }
             className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              Language
            </Label>
            <Input id="language" 
             value={addBook.language}
             onChange={(e) =>
               setAddBook({ ...addBook, language: e.target.value })
             }
            className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="copies" className="text-right">
              Total Copies
            </Label>
            <Input id="copies" 
             value={addBook.total_copies}
             onChange={(e) =>
               setAddBook({ ...addBook, total_copies: e.target.value,no_of_copies_available:e.target.value })
             }
             className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
            Price
            </Label>
            <Input id="price" 
             value={addBook.price}
             onChange={(e) =>
               setAddBook({ ...addBook, price: e.target.value })
             }
             className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddBook}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
              <TableHead>Pages</TableHead>
              <TableHead>Available copies</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.book_id}>
                <TableCell className='text-start'>{book.book_id}</TableCell>
                <TableCell className='text-start'>{book.title}</TableCell>
                <TableCell className='text-start'>{book.author}</TableCell>
                <TableCell className='text-start'>{book.genre}</TableCell>
                <TableCell className='text-start'>{book.language}</TableCell>
                <TableCell className='text-start'>{book.pages}</TableCell>
                <TableCell className='text-center'>{book.no_of_copies_available}</TableCell>
                <TableCell className='text-start'>{book.price}</TableCell>
                <TableCell className='text-start hover:cursor-pointer'>
                <Dialog>
  <DialogTrigger asChild>
    <Button variant='ghost' onClick={()=>handleEditClick(book)}><FaEdit className="size-5"/></Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit book details</DialogTitle>
      <DialogDescription>Enter book details to be updated</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="book_title" className="text-right">Book Name</Label>
        <Input id="book_title"
         value={editBook.title ?? book.title ?? ''}
          onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
          className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="author" className="text-right">Author</Label>
        <Input id="author" 
          value={editBook.author ?? book.author ?? ''}
          onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
          className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="genre" className="text-right">Genre</Label>
        <Select id='genre'
          value={editBook.genre ?? book.genre ?? ''}
          onValueChange={(value) => setEditBook({ ...editBook, genre: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Adventure">Adventure</SelectItem>
              <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
              <SelectItem value="Dystopian">Dystopian</SelectItem>
              <SelectItem value="Fiction">Fiction</SelectItem>
              <SelectItem value="Mystery">Mystery</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="Romance">Romance</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="pages" className="text-right">Pages</Label>
        <Input id="pages" 
          value={editBook.pages ?? book.pages ?? ''}
          onChange={(e) => setEditBook({ ...editBook, pages: e.target.value })}
          className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="language" className="text-right">Language</Label>
        <Input id="language" 
          value={editBook.language ?? book.language ?? ''}
          onChange={(e) => setEditBook({ ...editBook, language: e.target.value })}
          className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="total_copies" className="text-right">Total Copies</Label>
        <Input id="total_copies" 
          value={editBook.total_copies ?? book.total_copies ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            setEditBook((prev) => ({
              ...prev,
              total_copies: value,
              no_of_copies_available: prev.no_of_copies_available ?? value
            }));
          }}
                    className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">Price</Label>
        <Input id="price" 
          value={editBook.price ?? book.price ?? ''}
          onChange={(e) => setEditBook({ ...editBook, price: e.target.value })}
          className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit" onClick={() => handleSaveEdits(book)}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

                  </TableCell>
                <TableCell className='text-start hover:cursor-pointer'>
                <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={()=>setDeleteBook({...deleteBook,book_id:book.book_id,title:book.title})}> <MdDelete className="size-8"/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Book</DialogTitle>
          <DialogDescription>
            Enter book details to be deleted
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="book_id" className="text-right">
             Book Id
            </Label>
            <Input id="book_id" 
             value={deleteBook.book_id ?? book.book_id ?? ''}
             onChange={(e) =>
               setDeleteBook((prev) => ({ ...prev, book_id: e.target.value }))
             } className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bookname" className="text-right">
             Book Name
            </Label>
            <Input id="bookname" 
             value={deleteBook.title || book.title || ''}
             onChange={(e) =>
               setDeleteBook((prev) => ({ ...prev, title: e.target.value }))
             } className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit"onClick={()=>handleDeleteBook(book)}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
                 </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button onClick={()=>setRenterDetails(book)}>Rent</Button>
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
                            value={renterDetails.rented_book || book.title || ''}
                              onChange={(e) =>
                                setRenterDetails({ ...renterDetails,rented_book:e.target.value || `${book.title}`})
                              }                              className="col-span-2 h-8"
                             
                            />
                          </div>
                         
                        </div>
                        <Button onClick={()=>handleRentingBook(book)}>Rent</Button>
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
