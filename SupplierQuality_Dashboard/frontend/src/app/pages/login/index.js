// pages/login/index.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBIcon, MDBInput } from 'mdb-react-ui-kit';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', { // Adjust API endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // Handle login success (e.g., store token, redirect to dashboard)
      const { token } = await response.json();
      // Store token in local storage or cookies
      localStorage.setItem('userToken', token);
      router.push('/dashboard'); // Redirect to dashboard page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MDBContainer fluid>
      {/* Layout code... */}
      <form onSubmit={handleSubmit}>
        {/* Login fields... */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='formControlLg' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' id='formControlLg' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)} />
        <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg' type="submit">Login</MDBBtn>
        {/* Other elements... */}
      </form>
    </MDBContainer>
  );
}

export default Login;
