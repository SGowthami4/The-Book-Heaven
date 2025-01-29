import React from 'react'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

export default function UserPage() {
  return (
    <div>
      <nav className='flex gap-2'>
        <Link to="/admin">
       Admin
        </Link>|
        <Link to="/user">
        User
        </Link>|
        <Link to="/books">
        Books
        </Link>
      </nav>
    </div>
  )
}
