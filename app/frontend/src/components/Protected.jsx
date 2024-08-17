import React, { useContext } from 'react'
import { AuthContext } from '../Context/authContext'
import LoginPage from "../Pages/LoginPage"

const Protected = (props) => {
    const {isLogin} = useContext(AuthContext)
    const {Component} = props
  return (
 isLogin ? <Component/> : <LoginPage/>
  )
}

export default Protected