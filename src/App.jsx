import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import Home from './pages/home/Home'
import Header from './components/header/Header'
import Nav from './components/nav/Nav'
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {

  useEffect(() => {
    AOS.init({
      once: true, 
      duration: 600, 
      offset: 50, 
      
      // Optional: If animations lag on cheap phones, you can disable them entirely on mobile
      // disable: 'mobile' 
    });
  }, []);

  return (
      <BrowserRouter>
        <Header />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
