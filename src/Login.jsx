import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { EyeIcon,EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] =useState(false)
  const [loginMessage, setLoginMessage] = useState("");
  const [loggedIn,setLoggedIn]=useState(false)
  const [loading,setLoading]=useState(false)
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
 
  const handleLogin = async (e) => {
    setLoggedIn(true)
    e.preventDefault();
    if (!loginInfo.username || !loginInfo.password || !loginInfo.role) {
      setLoginMessage("All fields are required for login");
      return;
    }
    try {
      const response = await fetch("https://the-book-heaven-jkie.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || "Error Logging in");
      }
      const data = await response.json();
      console.log("Login successful:", data);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem('role',data.role)
      console.log(data.role);    
      setLoginMessage("Login successful!");
    } catch (error) {
      console.log(error);    
      setLoginMessage(error.response?.data?.message || "Error Logging in");
    }
  };
  
  return (
    <div className='flex justify-center'>
       <Card className={'w-5/6 max-w-[500px] '}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 ">
                <Label htmlFor="username" className=" flex justify-items-start">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={loginInfo.username}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className=" flex justify-items-start">
                  Password
                </Label>
                <div className={'flex justify-items-end items-center border border-gray-200 rounded-md'}>

                <Input
                   className={"border-none focus-visible:outline-none focus-visible:ring-0"}
                  id="password"
                  type={showPassword?'text':'password'}
                  placeholder="Password"
                  value={loginInfo.password}
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, password: e.target.value })
                  }
                />
                <span className='pr-4' onClick={handleClickShowPassword}>{showPassword?<EyeOff/>:<EyeIcon/>}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className=" flex justify-items-start">
                  Role
                </Label>
                <Select
                  value={loginInfo.role}
                  onValueChange={(value) => (
                    console.log(value),
                    setLoginInfo({ ...loginInfo, role: value })
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
            <Button onClick={handleLogin} disabled={loading} >        {loading?"Logging In...":"Login"}              </Button>

            </CardFooter>
            
            {loggedIn ? (
  loginMessage === 'Login successful!' ? (
   navigate('/userPage')
  //  <Alert className=' w-1/3 '>
  //     <AlertDescription>{loginMessage}</AlertDescription>
  //     <Button onClick={() => {navigate('/userPage'),setLoggedIn(false)}}>Continue</Button>
  //   </Alert>
  ) : (
    <div>
    <Alert>
      <AlertDescription className='text-sm font-semibold'>{loginMessage}</AlertDescription>
      <Button onClick={() => {navigate('/login'),setLoggedIn(false)}}>Try Again</Button>
    </Alert>
    </div>
  )
) : null}
<p className='p-2'>Not Registered?  <a href="/" className='text-indigo-700 hover:text-blue-500 underline'>Register</a></p>

          </Card>
    </div>
  );
}
