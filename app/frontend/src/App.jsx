import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import LoginPage from './Pages/LoginPage'
import SignUpPage from './Pages/SignUpPage'
import Nav from './components/navbar'
import SearchPage from './Pages/SearchPage'
import ChatPage from './Pages/ChatPage'
import Profile from './components/Profile'
import ChatUrlPage from './Pages/chatUrlPage'
import { Toaster } from 'react-hot-toast'
import Protected from './components/Protected'
import QuizPage from './Pages/QuizPage'

const App = () => {
  return (
   <>
   <Nav/>
   <Routes>
   <Route path='/' element={<Home />}/>
    <Route path='/login' element={<LoginPage />}/>
    <Route path='/signup' element={<SignUpPage />}/>
    <Route path='/search' element={<Protected Component={ SearchPage }/>}/>
    <Route path='/chat' element={<Protected Component={ ChatPage }/>}/>
    <Route path='/chat/:url' element={<Protected Component={ ChatUrlPage }/>}/>
    <Route path='/quiz' element={<Protected Component={ QuizPage } />}/>
   </Routes>
   <Toaster/>
   </>
  )
}

export default App