import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Form, Toast, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../AuthContext";
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
  const [isFullScreen, setIsFullScreen] = useState(false); // Track full-screen mode

  const toggleLock = () => {
    setLocked(!locked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainee({ ...trainee, [name]: value });
  };

  const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  };

  const handleFullScreenToggle = () => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
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

  // Event listener to track full-screen change
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      // Clean up event listeners
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, []);

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
    <div className={`smart-form-container ${isFullScreen ? "full-screen" : ""}`}>
      <div className="fullscreen-button">
        <Button variant="primary" onClick={handleFullScreenToggle}>
          Toggle Fullscreen
        </Button>
      </div>
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
