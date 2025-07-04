import React from 'react'
import '../styles/Amazon.css'
import list from '../data'
import Cards from './Cards'

const Amazon = ({handleClick}) => {
  return (
    <section>
        {list.map((item) => (<Cards item={item} key={item.id} handleClick={handleClick}/>))}
    </section>
  )
}

export default Amazon