import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Card, CardDescription, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import {useNavigate} from 'react-router-dom'

export default function UsersDetails({newUser,setNewUser }) {
  const [users,setUsers]=useState([])
   const navigate=useNavigate()
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3005/getAllUsers", {
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
    <div className='grid gap-3'>
      <div className='flex justify-end gap-2'>
        <Button onClick={()=>navigate('/admin')}>Back</Button>
      </div>
       {users.length > 0 ? (
        users.map((user) => (
          <Card key={user.user_id}>
            <CardTitle>
              <p>
              {user.user_id}: {user.username}
                </p>
                <p><strong>mail :</strong>{user.email}</p>
            </CardTitle>
            <CardDescription>
              {/* <div>
                {user.rentedbook_id!=0?
                <div>

                  <p>BookId:{user.rentedbook_id}</p>
                  <p>bookName:{user.rentedbook_name}</p>
                  <p>rentedDate:{user.rented_date}</p>
                  {user.returnstatus? <div><p>Return status:returned</p>
                  <p>Returned on:{user.returned_date}</p>
                  </div> : <p>Return status:Not returned yet</p>
                 }
                 <p>Quantity:{user.quantity?user.quantity:0}</p>
                </div>
              : <p>No  books rented Yet</p> }
              </div> */}
              <p>Books details</p>
            </CardDescription>
          </Card>
        ))
      ) : (
        <p>Users not found</p>
      )}
    </div>
  )
}
