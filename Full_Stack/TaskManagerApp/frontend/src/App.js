import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tasksList, setTasksList] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = () => {
    Axios.post('http://localhost:3001/create', {
      name: name, 
      description: description
    })
      .then(() => {
        setTasksList([
          ...tasksList,
          { name: name,
            description: description
          },
        ]);
        clearForm();
        alert('Task added successfully!');
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        alert('Could not add task. Please try again.');
      });
  };

  const getTasks = () => {
    Axios.get('http://localhost:3001/tasks')
      .then((response) => {
        setTasksList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        alert('Could not retrieve tasks data.');
      });
  };

  const updateTask = (id) => {
    Axios.put(`http://localhost:3001/update/${id}`, {
      name: name,
      description: description
    })
      .then(() => {
        setTasksList(
          tasksList.map((val) => {
            return val.id === id
              ? {
                  ...val,
                  name: editName,
                  description: editDescription
                }
              : val;
          })
        );
        setEditingId(null);
        alert('Task updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        alert('Could not update task. Please try again.');
      });
  };

  const deleteTask = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        setTasksList(tasksList.filter((val) => val.id !== id));
        alert('Task deleted!');
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        alert('Could not delete task.');
      });
  };

  const clearForm = () => {
    setName('');
    setDescription('');
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditName(task.name);
    setEditDescription(task.description);
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h4>Add Task</h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <button className="btn btn-success" onClick={addTask}>
            Add Task
          </button>
          <button className="btn btn-secondary ms-2" onClick={clearForm}>
            Clear
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-info text-white">
          <h4>Tasks List</h4>
        </div>
        <div className="card-body">
          {tasksList.length > 0 ? (
            <div className="row">
              {tasksList.map((val, key) => (
                <div className="col-md-6" key={key}>
                  <div className="alert alert-light p-3 mb-3">
                    {editingId === val.id ? (
                      <>
                        <div className="mb-2">
                          <label className="form-label">Name:</label>
                          <input
                            className="form-control"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Description:</label>
                          <input
                            className="form-control"
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                        </div>
                        <button
                          className="btn btn-success"
                          onClick={() => updateTask(val.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary ms-2"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <h5 className="alert-heading"> {val.name}</h5>
                        <p className="mb-0">Description: {val.description}</p>
                        <button
                          className="btn btn-warning"
                          onClick={() => startEditing(val)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => deleteTask(val.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No tasks to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;