import { Button } from './components/ui/button';
import { Popover, PopoverContent,PopoverTrigger} from './components/ui/popover';
import { useState, useEffect } from 'react';
import { Alert } from './components/ui/alert';
import { Table,TableBody,TableHeader,TableRow,TableCell,TableHead,TableCaption } from './components/ui/table';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import {useNavigate} from 'react-router-dom'
export default function RentedBooks() {
  const [rentedInfo, setRentedInfo] = useState([]);
  const [updateDetails, setUpdateDetails] = useState({
    s_no:'',
    user_id:'',
    username:'',
    book_id:'',
    rented_book:'',
    rental_quantity:'',
    rental_date:'',
    returned :false,
    returned_date:''
  });
  const navigate=useNavigate()

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
        setRentedInfo(data.rentedBooks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchingInfo();
  },[]);

  const handleEditClick = (entry) => {
    setUpdateDetails(entry); 
  };
  

  const handleSave = async (entry) => {
    try {
      const response = await fetch(`http://localhost:3005/rentedDetails/${entry.user_id}`, {
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
        prev.map((item) =>
          item.s_no === entry.s_no ? { ...item, ...updateDetails } : item
        )
      );
  
      setUpdateDetails({});
      alert("Rental details updated successfully!");
    } catch (error) {
      console.error("Error updating rental details:", error);
    }
  };
  

  return (
    <div  className=''>
          <div className='flex justify-end'>
            <Button onClick={()=>navigate('/admin')}>Back</Button>
          </div>
          <header>

        <h1 className='font-medium m-4 text-4xl'>Rental Details</h1>
          </header>
      {rentedInfo.length > 0 ? (
        <Table>
          <TableCaption>Rental Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>S No</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Book ID</TableHead>
              <TableHead>Book Name</TableHead>
              <TableHead>Rental Date</TableHead>
              <TableHead>Returned Status</TableHead>
              <TableHead>Returned Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentedInfo.map((entry) => (
              <TableRow key={entry.s_no}>
                <TableCell>{entry.s_no}</TableCell>
                <TableCell>{entry.user_id}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell>{entry.book_id}</TableCell>
                <TableCell>{entry.rented_book}</TableCell>
                <TableCell>{new Date(entry.rental_date).toLocaleDateString("en-GB")}</TableCell>
                <TableCell>{entry.returned === false ? 'NO' : 'YES'}</TableCell>
                <TableCell>{entry.returned_date === null ? '' : new Date(entry.returned_date).toLocaleDateString("en-GB")}</TableCell>
                <TableCell>
                  <Popover >
                    <PopoverTrigger asChild>
                    <Button onClick={() => handleEditClick(entry)}>Edit</Button>
                    </PopoverTrigger>
                     <PopoverContent className="w-72 h-96 overflow-y-scroll flex flex-col">
                      <div className="grid gap-4" >
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Edit details</p>
                        </div>
                        {Object.keys(entry).map((key) => (
                          !(key=='rental_quantity')?
                          <div key={key} className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor={key}>{key.replace('_', ' ')}</Label>
                            <Input
                              id={key}
                              value={updateDetails[key] || entry[key] || ''}
                              type={key==='returned_date'?'date':''}
                              onChange={(e) =>
                                setUpdateDetails((prev) => ({ ...prev, [key]: e.target.value }))
                              }
                              className="col-span-2 h-8"
                              disabled={key==="rental_date"}
                            />
                          </div>:
                         null
                        ))}
                      </div>
                      
                      <Button  className="my-4 place-self-center"  onClick={() => handleSave(entry)}>Save</Button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Alert>No books rented yet</Alert>
      )}
    </div>
  );
}
