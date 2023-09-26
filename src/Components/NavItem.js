import React from 'react'

export const NavItem = ({icon,name}) => {
  return (
    <div className='nav-item'>
        <img src={`./NavIcons/`+icon+`.png`} className='nav-icon' alt='loading'/>
        <p className='nav-text'>{name}</p>
    </div>
  )
}
