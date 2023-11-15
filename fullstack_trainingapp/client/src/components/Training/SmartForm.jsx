import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Form, Toast, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../Auth/AuthContext";
import { FaLock, FaUnlock } from "react-icons/fa";
import "./SmartForm.css";

const SmartForm = () => {
  const { token, isLoggedIn } = useContext(AuthContext);
  const [trainee, setTrainee] = useState({
    firstName: "",
    lastName: "",
    badgeNumber: "",
    title: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [trainerName, setTrainerName] = useState(""); // Keep setTrainerName
  const [locked, setLocked] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleLock = () => {
    setLocked(!locked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainee({ ...trainee, [name]: value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLoggedIn) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const payload = {
          ...trainee,
          trainer: trainerName,
        };
        const response = await axios.post(
          "http://127.0.0.1:5000/api/addNewTraining",
          payload,
          config
        );
        if (response.status === 201) {
          setShowToast(true);
          setLoading(false);
          setTrainee({
            firstName: "",
            lastName: "",
            badgeNumber: "",
            title: locked ? trainee.title : "",
            date: new Date().toISOString().split("T")[0],
          });
        }
      } catch (error) {
        setLoading(false);
        setError("There was an error submitting the form");
        console.error(error);
      }
    } else {
      setLoading(false);
      setError("Please log in to submit the form");
    }
  };

  
  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get("http://127.0.0.1:5000/api/getUserDetails", config);
        console.log("Server Response:", response.data); // Log the response

        if (response.data && response.data.name) {
          setTrainerName(response.data.name);
        }
      } catch (error) {
        console.error("Could not fetch trainer name:", error); // Log the error
      }
    };

    if (isLoggedIn) {
      fetchTrainerName();
    }
  }, [isLoggedIn, token]);

  return (
    <div className={`smart-form-container `}>
      <h1>
        {locked ? trainee.title : <input type="text" value={trainee.title} onChange={handleChange} name="title" />}
      </h1>
      <button className="lock-button" onClick={toggleLock}>
        {locked ? <FaLock /> : <FaUnlock />}
      </button>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="smart-form" onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={trainee.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={trainee.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Badge Number</Form.Label>
          <Form.Control
            type="text"
            name="badgeNumber"
            value={trainee.badgeNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" value={trainee.date} readOnly />
        </Form.Group>
        <Form.Group>
          <Form.Label>Trainer's Name</Form.Label>
          <Form.Control type="text" value={trainerName} readOnly />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
        </Button>
      </Form>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="mr-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>
          Thank you, {trainee.firstName}. You've been added to the training session.
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default SmartForm;
