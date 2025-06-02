import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState(0);
  const [employeeList, setEmployeeList] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState(0);
  const [editCountry, setEditCountry] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editSalary, setEditSalary] = useState(0);

  useEffect(() => {
    getEmployees();
  }, []);

  const addEmployee = () => {
    Axios.post('http://localhost:3001/create', {
      fullname: name,
      age: age,
      country: country,
      position: position,
      salary: salary,
    })
      .then(() => {
        setEmployeeList([
          ...employeeList,
          { fullname: name, age: age, country: country, position: position, salary: salary },
        ]);
        clearForm();
        alert('Employee added successfully!');
      })
      .catch((error) => {
        console.error('Error adding employee:', error);
        alert('Could not add employee. Please try again.');
      });
  };

  const getEmployees = () => {
    Axios.get('http://localhost:3001/employees')
      .then((response) => {
        setEmployeeList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        alert('Could not retrieve employee data.');
      });
  };

  const updateEmployee = (id) => {
    Axios.put(`http://localhost:3001/update/${id}`, {
      fullname: editName,
      age: editAge,
      country: editCountry,
      position: editPosition,
      salary: editSalary,
    })
      .then(() => {
        setEmployeeList(
          employeeList.map((val) => {
            return val.id === id
              ? {
                  ...val,
                  fullname: editName,
                  age: editAge,
                  country: editCountry,
                  position: editPosition,
                  salary: editSalary,
                }
              : val;
          })
        );
        setEditingId(null);
        alert('Employee updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating employee:', error);
        alert('Could not update employee. Please try again.');
      });
  };

  const deleteEmployee = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        setEmployeeList(employeeList.filter((val) => val.id !== id));
        alert('Employee deleted!');
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
        alert('Could not delete employee.');
      });
  };

  const clearForm = () => {
    setName('');
    setAge(0);
    setCountry('');
    setPosition('');
    setSalary(0);
  };

  const startEditing = (employee) => {
    setEditingId(employee.id);
    setEditName(employee.fullname);
    setEditAge(employee.age);
    setEditCountry(employee.country);
    setEditPosition(employee.position);
    setEditSalary(employee.salary);
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h4>Add Employee</h4>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name:
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
            <label htmlFor="age" className="form-label">
              Age:
            </label>
            <input
              type="number"
              className="form-control"
              id="age"
              value={age}
              onChange={(event) => setAge(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="country" className="form-label">
              Country:
            </label>
            <input
              type="text"
              className="form-control"
              id="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="position" className="form-label">
              Position:
            </label>
            <input
              type="text"
              className="form-control"
              id="position"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="salary" className="form-label">
              Salary:
            </label>
            <input
              type="number"
              className="form-control"
              id="salary"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
            />
          </div>
          <button className="btn btn-success" onClick={addEmployee}>
            Add Employee
          </button>
          <button className="btn btn-secondary ms-2" onClick={clearForm}>
            Clear
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-info text-white">
          <h4>Employee List</h4>
        </div>
        <div className="card-body">
          {employeeList.length > 0 ? (
            <div className="row">
              {employeeList.map((val, key) => (
                <div className="col-md-6" key={key}>
                  <div className="alert alert-light p-3 mb-3">
                    {editingId === val.id ? (
                      <>
                        <div className="mb-2">
                          <label className="form-label">Name</label>
                          <input
                            className="form-control"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Age</label>
                          <input
                            className="form-control"
                            type="number"
                            value={editAge}
                            onChange={(e) => setEditAge(parseInt(e.target.value))}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Country</label>
                          <input
                            className="form-control"
                            value={editCountry}
                            onChange={(e) => setEditCountry(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Position</label>
                          <input
                            className="form-control"
                            value={editPosition}
                            onChange={(e) => setEditPosition(e.target.value)}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Salary</label>
                          <input
                            className="form-control"
                            type="number"
                            value={editSalary}
                            onChange={(e) => setEditSalary(parseInt(e.target.value))}
                          />
                        </div>
                        <button
                          className="btn btn-success"
                          onClick={() => updateEmployee(val.id)}
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
                        <h5 className="alert-heading"> {val.fullname}</h5>
                        <p className="mb-0">Age: {val.age}</p>
                        <p className="mb-0">Country: {val.country}</p>
                        <p className="mb-0">Position: {val.position}</p>
                        <p className="mb-0">Salary: {val.salary}</p>
                        <button
                          className="btn btn-warning"
                          onClick={() => startEditing(val)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => deleteEmployee(val.id)}
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
            <p>No employees to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;