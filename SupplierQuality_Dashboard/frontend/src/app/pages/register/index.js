import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBIcon, MDBInput } from 'mdb-react-ui-kit';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName, department }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      // Redirect to login page on successful registration
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <MDBContainer fluid>
      {/* Layout code... */}
      <form onSubmit={handleSubmit}>
        {/* Registration fields... */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='First Name' id='firstName' type='text' size="lg" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Last Name' id='lastName' type='text' size="lg" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Department' id='department' type='text' size="lg" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' id='email' type='email' size="lg" value={email} onChange={(e) => setEmail(e.target.value)} />
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password' id='password' type='password' size="lg" value={password} onChange={(e) => setPassword(e.target.value)} />
        <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg' type="submit">Register</MDBBtn>
        {/* Other elements... */}
      </form>
    </MDBContainer>
  );
}

export default Register;
