import React from 'react'

const Header = (props) => {
    const { todos } = props;
    const todosLength = todos.length;

    const isTasksPlural = todosLength !== 1;
  return (
    <header>
        <h1 className='text-gradient'>{todosLength} { isTasksPlural ? 'Tasks' : 'Task'}</h1>
    </header>
  )
}

export default Header