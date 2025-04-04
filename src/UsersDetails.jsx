import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import {useNavigate} from 'react-router-dom'

export default function UsersDetails({newUser,setNewUser }) {
  const [users,setUsers]=useState([])
   const navigate=useNavigate()
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch("https://the-book-heaven-2lp4.onrender.com/getAllUsers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status:${response.status}`);
        }
        const data = await response.json();
        setUsers(data.allUsers)
        setNewUser(false)
      } catch (error) {
        console.log(error);
        
      }
    };
    fetchData();
  },[newUser])
  return (
    <div className=''>
      <h1 className='font-medium m-4 text-4xl'>Users Details</h1>
      <div className='flex justify-end gap-2 m-2'>
        <Button onClick={()=>navigate('/admin')}>Back</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-full gap-8 text-start">
       {users.length > 0 ? (
        users.map((user) => 
        
          <Card key={user.user_id} className='p-4 border-b-4 border-r-4'>
            <CardContent>
              <p>
              <strong>UserID : </strong> {user.user_id}
                </p>
              <p><strong>UserName : </strong>{user.username}</p>
                <p><strong>mail : </strong>{user.email}</p>
            </CardContent>
            <CardFooter>
              <p>
            <strong>Rented Books: </strong> 
            {user.rented_books && user.rented_books.length > 0 
  ? user.rented_books.join(", ") 
  : "No rented books"}
              </p>
            </CardFooter>
          </Card>
       )
      ) : (
        <p>Users not found</p>
      )}
      </div>
    </div>
  )
}
