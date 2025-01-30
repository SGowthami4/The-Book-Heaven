import React from "react";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import {useNavigate} from 'react-router-dom';
import { Alert,AlertDescription } from "./components/ui/alert";


function User() {
  const [message, setMessage] = useState("");
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

        setMessage(data.message);
      } catch (error) {
        setMessage("Error Fetching user data");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>User Page</h1>
      <div className="flex justify-end">
        <Button onClick={()=>navigate('/userPage')}>Back</Button>
      </div>
      <div>

      {!(message === 'Welcome to admin page') ? (
      <Alert>
      <AlertDescription>
        <p>{message || "Loading..."}</p>
      </AlertDescription>
    </Alert>   
    ) : (
     <div>
     <p>Books</p>
     </div>
    )}
      </div>
    </div>
  );
}

export default User;
