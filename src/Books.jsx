import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Alert } from './components/ui/alert';
import { Card,CardHeader,CardTitle,CardContent, CardDescription } from './components/ui/card';
import { Button } from './components/ui/button';
import {useNavigate} from 'react-router-dom';

export default function Books() {
  const [fetchingbooks,setFetchingBooks]=useState('');
  const navigate=useNavigate()
  useEffect(()=>{
    const fetchedBooks=async()=>{
      try{
        const response=await fetch("http://localhost:3005/books",{
          method:"GET",
          headers:{
            Authorization:`Bearer ${localStorage.getItem('authToken')}`,
        },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }
        const data = await response.json();
        setFetchingBooks(data.books)  
      }catch(error){
        console.log(error);
        
      }
    };
    fetchedBooks();
  },[])
  return (
    <div className="p-4">
      <div className="flex justify-end" >
      <Button onClick={()=>navigate('/userPage')} >Back</Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      {fetchingbooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-full gap-10">
          {fetchingbooks.map((book) => (
            <Card key={book.book_id}>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>{book.isbn}</CardDescription>
              </CardHeader>
              <CardContent>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Price:</strong> ₹ {book.price}</p>
                <p><strong>Pages:{book.pages}</strong></p>
                <p><strong>Language:</strong>{book.language}</p>
                <p><strong>Copies Available:</strong> {book.no_of_copies_available}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert>
          <p>No books found</p>
        </Alert>
      )}
    </div>
  );
}
