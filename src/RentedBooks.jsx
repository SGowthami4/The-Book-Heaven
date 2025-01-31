import { Button } from './components/ui/button';
import { Popover, PopoverContent } from './components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { useState, useEffect } from 'react';
import { Alert } from './components/ui/alert';
import { Table,TableBody,TableHeader,TableRow,TableCell,TableHead,TableCaption } from './components/ui/table';
import { Label } from './components/ui/label';
import { Input } from './components/ui/input';
import {useNavigate} from 'react-router-dom'
export default function RentedBooks() {
  const [rentedInfo, setRentedInfo] = useState([]);
  const [updateDetails, setUpdateDetails] = useState({});
  const [refresh, setRefresh] = useState(false);
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
  }, [refresh]);

  const handleEdit = async (entry) => {
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
        prev.map((item) => (item.user_id === entry.user_id ? { ...item, ...updateDetails } : item))
      );

      setRefresh(!refresh);
      setUpdateDetails({});
      alert("Rental details updated successfully!");
    } catch (error) {
      console.error("Error updating rental details:", error);
    }
  };

  return (
    <div>
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
              <TableHead>Entry No</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Book ID</TableHead>
              <TableHead>Book Name</TableHead>
              <TableHead>Quantity</TableHead>
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
                <TableCell>{entry.rental_quantity}</TableCell>
                <TableCell>{entry.rental_date}</TableCell>
                <TableCell>{entry.returned === null ? 'NO' : 'YES'}</TableCell>
                <TableCell>{entry.returned_date === null ? '' : entry.returned_date}</TableCell>
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
                        {Object.keys(entry).map((key) => (
                          <div key={key} className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor={key}>{key.replace('_', ' ')}</Label>
                            <Input
                              id={key}
                              value={updateDetails[key] }
                              type={key==='returned_date'?'date':''}
                              onChange={(e) =>
                                setUpdateDetails((prev) => ({ ...prev, [key]: e.target.value }))
                              }
                              className="col-span-2 h-8"
                              disabled={key==="rental_date"}
                            />
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => handleEdit(entry)}>Save</Button>
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
