// Layout.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { AuthContext } from '../AuthContext'; // Ensure the import path is correct

const Layout = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext); // Ensure AuthContext is imported correctly

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h2>Welcome, User!</h2> {/* You can customize this message */}
          {children}
        </>
      ) : (
        <>
          <h2>Please <Link to="/login">log in</Link> to access this content.</h2> {/* Add the login link here */}
        </>
      )}
    </div>
  );
};

export default Layout;
