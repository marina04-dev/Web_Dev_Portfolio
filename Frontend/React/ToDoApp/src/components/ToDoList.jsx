import React from 'react'
import ToDoCard from './ToDoCard';

const ToDoList = (props) => {
    const { todos } = props;
    const tab = 'All';
    const filterToDoList = tab === 'All' ? todos : tab === 'Completed' ?   todos.filter(val => val.complete) : todos.filter(val => !val.complete)
  return (
    <>
        {filterToDoList.map((todo, todoIndex) => {
            return (
                <ToDoCard key={todoIndex} todoIndex={todos.findIndex(val => val.input === todo.input)} {...props} todo={todo}/>
            )
        })}
    </>
  )
}

export default ToDoList