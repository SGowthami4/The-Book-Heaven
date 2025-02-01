import React,{useState} from 'react'
import { Button } from './components/ui/button'
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select,SelectTrigger,SelectItem,SelectValue,SelectGroup,SelectContent } from './components/ui/select';

export default function Register({setNewUser}) {
  const [form, setform] = useState({ username: "", password: "", role: "" ,email:""});
  const [message, setMessage] = useState("");
  const [registered,setRegistered]=useState(false)
  const handleRegistration = async (e) => {
    setRegistered(true)
    if (!form.username || !form.password || !form.role || !form.email) {
      setMessage("All fields are required for login");
      return;
    }
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3005/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || "Registration Failed");
      }
      const data = await response.json();
      setMessage("registered Successfully");
      setNewUser(true)
    } catch (error) {
      setMessage(error.message || "Error registering user");
    }
  };
  const navigate=useNavigate()
  return (
    <div>
       <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1 ">
                <Label htmlFor="name" className=" flex justify-items-start">
                  Username
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={form.username}
                  onChange={(e) =>
                    setform({ ...form, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className=" flex justify-items-start">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setform({ ...form, password: e.target.value })
                  }
                />
                 <Label htmlFor="email" className=" flex justify-items-start">
                  Mail Id
                </Label>
                 <Input
                  id="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) =>
                    setform({ ...form, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className=" flex justify-items-start">
                  Role
                </Label>
                <Select
                  value={form.role}
                  onValueChange={(value) => (
                    console.log(value),
                    setform({ ...form, role: value })
                  )}
                  id="role"
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRegistration}>Register</Button>
            </CardFooter>
            {registered ? (
  message === 'registered Successfully' ? (
    <Alert className='align-middle'>
      <AlertDescription>Registered Successfully</AlertDescription>
      <Button onClick={() => {navigate('/login'),setRegistered(false)}}>Login</Button>
    </Alert>
  ) : (
    <Alert>
      <AlertDescription>{message}</AlertDescription>
      <Button onClick={() => {navigate('/'),setRegistered(false)}}>Try Again</Button>
    </Alert>
  )
) : null}

          </Card>
    </div>
  )
}
