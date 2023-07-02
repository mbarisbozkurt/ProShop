import React from 'react'
import Header from './components/Header';
import {Container} from "react-bootstrap";
import Footer from "./components/Footer"

const App = () => {
  return (
    <>
      <Header />
        <main className='py-3'> {/*py-3: padding on the y axis*/}
          <Container>
            <h1>Welcome To Proshop</h1>
          </Container>
        </main>
      <Footer/>
    </>
  )
}

export default App;