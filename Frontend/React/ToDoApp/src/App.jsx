import Header from './components/Header'
import './App.css'
import Tabs from './components/Tabs'
import ToDoList from './components/ToDoList'
import ToDoInput from './components/ToDoInput'
import { useState, useEffect } from 'react'

function App() {
  const [todos, setToDos] = useState([{
    input: 'Add your first task!', complete: true
  }]);

  function handleAddToDo(newToDo) {
    const newToDoList = [...todos, {input: newToDo, complete: false}];
    setToDos(newToDoList);
    handleSaveData(newToDoList);
  }

  function handleEditToDo(index) {
    let newToDoList = [...todos];
    let completedToDo = todos[index];
    completedToDo['complete'] = true;
    newToDoList[index] = completedToDo;
    setToDos(newToDoList);
    handleSaveData(newToDoList);
  }

  function handleDeleteToDo(index) {
    let newToDoList = todos.filter((val, valIndex) => {
      return valIndex !== index;
    });
    setToDos(newToDoList);
    handleSaveData(newToDoList);
  }

  function handleSaveData(currToDos) {
    localStorage.setItem('todo-app', JSON.stringify({todos: currToDos}))
  }

  useEffect(() => {
    if (!localStorage || localStorage.getItem('todo-app')) {return};
    let db = JSON.parse(localStorage.getItem('todo-app'));
    setToDos(db.todos);
  }, [todos]);
  return (
    <>
      <Header todos={todos}/>
      <Tabs todos={todos}/>
      <ToDoList handleEditToDo={handleEditToDo} handleDeleteToDo={handleDeleteToDo} todos={todos}/>
      <ToDoInput handleAddToDo={handleAddToDo}/>
    </>
  )
}

export default App
