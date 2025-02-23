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
import { EyeIcon,EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select,SelectTrigger,SelectItem,SelectValue,SelectGroup,SelectContent } from './components/ui/select';
export default function Register({setNewUser}) {
  const [showPassword, setShowPassword] =useState(false)
  const [form, setform] = useState({ username: "", password: "", role: "" ,email:""});
  const [message, setMessage] = useState("");
  const [registered,setRegistered]=useState(false)
  const [loading,setLoading]=useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.role || !form.email) {
      setMessage("All fields are required for login");
      return;
    }
   setLoading(true);
    try {
      const response = await fetch("https://the-book-heaven-jkie.onrender.com/register", {
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
      setMessage("A verification link has been sent to your email.Please check your inbox");
      setRegistered(true)
      setNewUser(true)
      setform({ username: "", password: "", role: "" ,email:""})
    } catch (error) {
      setMessage(error.message || "Error registering user");
    }finally{
      setLoading(false);
    }
  };
  const navigate=useNavigate()
  return (
    <div className='flex justify-center'>
       <Card className={'w-5/6 max-w-[500px] '}>
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
                <div className={'flex justify-items-end items-center border border-gray-200 rounded-md'}
                >
                  
                <Input 
                className={"border-none focus-visible:outline-none focus-visible:ring-0"}
                  id="password"
                  type={showPassword?'text':'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) =>
                    setform({ ...form, password: e.target.value })
                  }
                  
                />
                <span className='pr-4' onClick={handleClickShowPassword}>{showPassword?<EyeOff/>:<EyeIcon/>}</span>
                </div>
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
              <div className="space-y-2 ">
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
                  <SelectTrigger className="w-2/3">
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
              <Button onClick={handleRegistration} disabled={loading} >        {loading?"Registering...":"Register"}
              </Button>
            </CardFooter>
            {registered ? (
  message === 'registered Successfully' ? (
    navigate('/login')
    // <Alert className='align-middle'>
    //   <AlertDescription>Registered Successfully</AlertDescription>
    //   <Button onClick={() => {navigate('/login'),setRegistered(false)}}>Login</Button>
    // </Alert>
  ) : (
    <Alert>
      <AlertTitle>{message}</AlertTitle>
      <Button onClick={() => {navigate('/'),setRegistered(false)}}>Try Again</Button>
    </Alert>
  )
) : null}
<p className='p-2'>Already Registered? <a href="/login" className='text-indigo-700 hover:text-blue-500 underline'>Login</a></p>
          </Card>
    </div>
  )
}
