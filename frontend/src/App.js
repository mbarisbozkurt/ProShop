import React from 'react'
import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom" /*to be able to use router*/
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from './components/Header';
import Footer from "./components/Footer"

const App = () => {
  return (
    <>
      <Header />
        <main className='py-3'> {/*py-3: padding on the y axis*/}
          <Container>
            <Outlet/> {/*Index.js'deki yönlendirmelerin sonucunda yerine konulacak içeriği temsil ediyo*/}
          </Container>
        </main>
      <Footer/>
      <ToastContainer/> {/*Doesnt matter where it is rendered*/}
    </>
  )
}

export default App;