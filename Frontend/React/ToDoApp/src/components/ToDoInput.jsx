import React from 'react'

const ToDoInput = () => {
  return (
    <div className='input-container'>
      <input placeholder='Enter Task'/>
      <button>
        <i className='fa-solid fa-plus'></i>
      </button>
    </div>
  )
}

export default ToDoInput