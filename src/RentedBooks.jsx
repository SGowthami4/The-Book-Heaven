import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue } from "@/components/ui/select";
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import { Alert } from './components/ui/alert';
import { Button } from './components/ui/button';
import { Popover, PopoverContent } from './components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
export default function RentedBooks() {
  const [rentedInfo,setRentedInfo]=useState([])
  const [updateDetails,setUpdateDetails]=useState({})
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchingInfo = async () => {
      try {
        const response = await fetch("http://localhost:3005/rentedDetails", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRentedInfo(data.rentedBooks );
      } catch (error) {
        console.log(error);
      }
    };
    fetchingInfo();
  }, [refresh]);

  
  const handleEdit = async () => {
    if (!updateDetails) return;

    try {
      const response = await fetch(`http://localhost:3005/rentedDetails/${rentedInfo.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(updateDetails),
      });

      if (!response.ok) {
        throw new Error(`Failed to update rental details`);
      }

      
      setRentedInfo((prev) =>
        prev.map((entry) =>
          entry.user_id === updateDetails.user_id ? { ...entry, ...updateDetails } : entry
        )
      );
      
      setRefresh(true)
      setUpdateDetails({});
    } catch (error) {
      console.error("Error updating rental details:", error);
    }
  };


  return (
    <div>
      {/* {rentedMessage && <Alert>{rentedMessage}</Alert>} */}
      {rentedInfo.length > 0 ? (
        <Table>
          <TableCaption>Rental Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Entry No</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>username</TableHead>
              <TableHead>Book ID</TableHead>
              <TableHead>Book Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Rental Date</TableHead>
              <TableHead>Returned Status</TableHead>
              <TableHead>Returned Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {rentedInfo.map((entry)=>(
            
            <TableRow key={entry.s_no}>
              <TableCell>{entry.s_no}</TableCell>
             <TableCell>{entry.user_id}</TableCell>
              <TableCell>{entry.username}</TableCell>
              <TableCell>{entry.book_id}</TableCell>
              <TableCell>{entry.rented_book}</TableCell>
              <TableCell>{entry.rental_quantity}</TableCell>
              <TableCell>{entry.rental_date}</TableCell>
              <TableCell>{entry.returned===null?'NO':"YES"}</TableCell>
              <TableCell>{entry.returned_date===null?'-':`${entry.returned_date}`}</TableCell>
              <TableCell>
              <Popover>
                    <PopoverTrigger asChild>
                      <Button>Rent</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Edit details</p>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
  <Label htmlFor="s_no">Entry No</Label>
  <Input
    id="s_no"
    value={updateDetails?.s_no}
    onChange={(e) =>
      setUpdateDetails((prev) => ({
        ...prev,
        s_no: entry.s_no,  // Make sure s_no is always set
      }))
    }
    className="col-span-2 h-8"
  />
</div>

                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="user_id">UserId</Label>
                            <Input
                              id="user_id"
                              value={updateDetails?.user_id ?? entry.user_id}

                              type="number"
                              onChange={(e) =>
                                setUpdateDetails((prev) => ({ ...prev, user_id: e.target.value }))
                              }                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="user_name">UserName</Label>
                            <Input
                              id="user_name"
                              value={updateDetails?.username ?? entry.username}

                              onChange={(e) =>
                                setUpdateDetails((prev) => ({ ...prev, username: e.target.value }))
                              }                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="book_id">Book ID</Label>
                            <Input
                              id="book_id"
                              value={updateDetails?.book_id ?? entry.book_id}

                              onChange={(e) =>
                                setUpdateDetails((prev) => ({ ...prev, book_id: e.target.value }))
                              }                              className="col-span-2 h-8"
                             
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="rented_book">Book Name</Label>
                            <Input
                              id="rented_book"
                              value={updateDetails?.rented_book ?? entry.rented_book}

                              onChange={(e) =>
                                setUpdateDetails((prev) => ({ ...prev, rented_book: e.target.value }))
                              }                              className="col-span-2 h-8"
                             
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="rental_quantity">Quantity</Label>
                            <Input
                              id="rental_quantity"
                              type="number"
                             value={updateDetails?.rental_quantity ?? entry.rental_quantity}

                              onChange={(e) =>
                                setUpdateDetails((prev) => ({ ...prev, rental_quantity: e.target.value }))
                              }                              className="col-span-2 h-8"
                              min="1"
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                          <Select
  value={updateDetails?.returned !== undefined ? String(updateDetails.returned) : (entry.returned ? "true" : "false")}
  onValueChange={(value) =>
    setUpdateDetails((prev) => ({ ...prev, returned: value === "true" }))
  }
>
  <SelectTrigger className="w-[180px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Return status</SelectLabel>
      <SelectItem value="true">Yes</SelectItem>
      <SelectItem value="false">No</SelectItem>     
    </SelectGroup>
  </SelectContent>
</Select>

                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="returned_date">Returned Date</Label>
                            <Input
                              id="returned_date"
                              type='date'
                              value={updateDetails?.returned_date ?? entry.returned_date?? ""}

                              onChange={(e) =>
                                setUpdateDetails((prev) => ({ ...prev, returned_date: e.target.value || null  }))
                              }                              className="col-span-2 h-8"
                             
                            />
                          </div>
                        </div>
                        
                        <Button onClick={handleEdit}>Save</Button>
                      
                    </PopoverContent>
                </Popover>
              </TableCell>
          </TableRow>
          ))}
          </TableBody>
        </Table>
      ) : (
        <Alert>Loading...</Alert>
        )   }
    </div>
  )
}
