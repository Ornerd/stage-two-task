import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ChangeTitle = (name) => {
    const windowLocation = useLocation();
  useEffect(()=> {
    document.title = name
  }, [windowLocation, name])
}

export default ChangeTitle;