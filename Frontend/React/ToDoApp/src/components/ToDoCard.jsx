import React from 'react'

const ToDoCard = (props) => {
    const { todo, handleDeleteToDo, todoIndex, handleEditToDo } = props;
    
  return (
    <div className='card todo-item'>
        <p>{todo.input}</p>
        <div className='todo-button'>
            <button onClick={() => handleEditToDo(todoIndex)} disabled={todo.complete}><h6>Done</h6></button>
            <button onClick={() => {
              handleDeleteToDo(todoIndex)
            }}><h6>Delete</h6></button>
        </div>
    </div>
  )
}

export default ToDoCard