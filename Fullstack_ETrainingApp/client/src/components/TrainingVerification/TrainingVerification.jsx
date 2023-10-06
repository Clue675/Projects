import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./TrainingVerification.css";

const TrainingVerification = () => {
  const token = localStorage.getItem("token");
  const [trainings, setTrainings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [trainingsPerPage] = useState(5);
  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newData, setNewData] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    console.log(trainings);
  }, [trainings]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/training-verification",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrainings(response.data);
      } catch (error) {
        toast.error("Error fetching training data");
        console.error(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedTrainings([...selectedTrainings, id]);
    } else {
      setSelectedTrainings(selectedTrainings.filter((item) => item !== id));
    }
  };

  const handleDelete = async (id) => {
    console.log("ID to delete:", id); // Debug line
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/trainings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Training successfully deleted");
        // Remove the deleted training from the list
        const updatedTrainings = trainings.filter(
          (training) => training.id !== id
        );
        setTrainings(updatedTrainings);
      }
    } catch (error) {
      toast.error("Error deleting training data");
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/trainings/${id}`,
        newData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrainings(
        trainings.map((training) =>
          training.id === id ? response.data : training
        )
      );
      toast.success("Record updated successfully");
    } catch (error) {
      toast.error("Error updating training data");
    }
  };

  const handleExportToExcel = async () => {
    try {
      const selectedData = trainings.filter((training) => selectedTrainings.includes(training.id)).map((training) => {
        return {
          ...training,
          workcenter: "PLACEHOLDER",  // Adding a placeholder for the work center
        };
      });
  
      const response = await axios.post(
        "http://localhost:5000/api/export_to_excel",
        selectedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Selected data successfully exported to Excel");
        // Remove exported data from the display
        const remainingTrainings = trainings.filter((training) => !selectedTrainings.includes(training.id));
        setTrainings(remainingTrainings);
        setSelectedTrainings([]);
      }
    } catch (error) {
      toast.error("Error exporting selected data to Excel");
      console.error(error);
    }
  };
  
  
  const indexOfLastTraining = currentPage * trainingsPerPage;
  const indexOfFirstTraining = indexOfLastTraining - trainingsPerPage;
  const currentTrainings = trainings.slice(
    indexOfFirstTraining,
    indexOfLastTraining
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const startEditing = (id, currentData) => {
    setEditingId(id);
    setNewData(currentData);
  };

  return (
    <div className="training-verification-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>Training Verification</h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table>
            <thead>
              <tr>
              <th>Select</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Badge Number</th>
                <th>Training Title</th> {/* Moved this up */}
                <th>Trainer</th> {/* Moved this up */}
                <th>Date</th> {/* Moved this up */}
                <th>Work Center</th> {/* Moved this down */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTrainings.map((training) => (
                <tr key={training.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedTrainings.includes(training.id)}
                      onChange={(e) => handleCheckboxChange(e, training.id)}
                    />
                  </td>
                  <td>{training.firstName}</td>
                  <td>{training.lastName}</td>
                  <td>{training.badgeNumber}</td>
                  <td>{training.title}</td> {/* Moved this up */}
                  <td>{training.trainer}</td> {/* Moved this up */}
                  <td>{training.date}</td> {/* Moved this up */}
                  <td>{""}</td> {/* Moved this down, Work Center placeholder */}
                  <td>
                    {editingId === training.id ? (
                      <button onClick={() => handleUpdate(training.id)}>
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(training.id, training)}
                      >
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(training.id)}>
                      Delete
                    </button>
                    <button onClick={handleExportToExcel}>
                      Export to Excel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(trainings.length / trainingsPerPage) },
              (_, i) => i + 1
            ).map((number) => (
              <button key={number} onClick={() => paginate(number)}>
                {number}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TrainingVerification;
