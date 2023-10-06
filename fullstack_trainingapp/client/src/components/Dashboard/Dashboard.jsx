import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Auth/AuthContext";
import "./Dashboard.css";
import { Line } from "react-chartjs-2";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [trainingData, setTrainingData] = useState(null);
  const { token } = useContext(AuthContext);

  const updateAccessLevel = async (username, newAccessLevel) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/update_access",
        { username, newAccessLevel },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        const updatedUsers = users.map((user) => {
          if (user.username === username) {
            user.access_level = newAccessLevel;
          }
          return user;
        });
        setUsers(updatedUsers);
      } else {
        setError(response.data.message || "Failed to update access level");
      }
    } catch (error) {
      console.error("Error updating access level:", error);
      setError(error.message || "An unknown error occurred");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setError(null);
        const response = await axios.get("http://localhost:5000/api/users/level1_and_2", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          if (isMounted) {
            setUsers(response.data.users);
          }
        } else {
          if (isMounted) {
            setError(response.data.message || "An unknown error occurred");
          }
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (isMounted) {
          setError(error.message || "An unknown error occurred");
        }
      }
    };

    const fetchTrainingData = async () => {
      if (isMounted) {
        setTrainingData({
          labels: ["January", "February", "March", "April", "May"],
          datasets: [
            {
              label: "Training Completed",
              data: [12, 19, 3, 5, 2],
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        });
      }
    };

    fetchUsers();
    fetchTrainingData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-left">
          {trainingData ? (
            <Line
              data={trainingData}
              options={{
                scales: {
                  x: { type: 'linear', title: { display: true, text: 'Date' } },
                  y: { type: 'linear', title: { display: true, text: 'Training Count' } },
                },
              }}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="dashboard-right">
          {error && <div className="error-message">{error}</div>}
          <div className="user-list">
            <h2>Users with Level 1 and Level 2 Access</h2>
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Work Center</th>
                  <th>Access Level</th>
                  <th>Update Access</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.work_center}</td>
                    <td>{user.access_level}</td>
                    <td>
                      <button onClick={() => updateAccessLevel(user.username, user.access_level === 1 ? 2 : 1)}>
                        {user.access_level === 1 ? "Upgrade to Level 2" : "Downgrade to Level 1"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


