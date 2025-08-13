import React from 'react'
import {Link} from 'react-router-dom';

const AdminHome = () => {
  return (
    <div style={{ paddingTop: '8rem'}}>
        <h1>Admin Home Page</h1>
        <Link to="/blogs-admin" style={{ color: 'blue', textDecoration: 'underline' }}><br/>
          Manage Blogs 
        </Link><br/><br/>
        <Link to="/products-admin" style={{ color: 'blue', textDecoration: 'underline' }}>
          Manage Products 
        </Link>
        

    </div>
  )
}

export default AdminHome