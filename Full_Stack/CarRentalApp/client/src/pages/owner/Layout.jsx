import React from 'react'
import Sidebar from '../../components/owner/Sidebar'
import NavBarOwner from '../../components/owner/NavBarOwner'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { useEffect } from 'react'

const Layout = () => {

  const { isOwner, navigate } = useAppContext();

  useEffect(() => {
    if (!isOwner) {
      navigate('/');
    }
  },[isOwner]);

  return (
    <div className='flex flex-col'>
      <NavBarOwner/>
      <div className='flex'>
        <Sidebar/>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout