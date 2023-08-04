import React from 'react'
import {Form, Button, FormGroup, FormControl, Row, Col} from "react-bootstrap"
import { useState } from 'react'
import {useNavigate} from 'react-router-dom';

const SearchBox = () => {

  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  const submitHandler = (event) => {
    event.preventDefault();
    //console.log(keyword);
    const cleanedKeyword = keyword.trim(); //whatever user is entered "phone" or "  phone  ", make it "phone"

    if(cleanedKeyword){
      navigate(`/search/${cleanedKeyword}`); //navigates to home screen, look at the index.js
      setKeyword(""); //reset whatever is written in the search box
    }else{
      navigate("/");
    }
  }

  return (
    <Form onSubmit={submitHandler} className='mx-3'>
      <Row>
        <Col>
          <FormGroup controlId='searchBox'>
            <FormControl
              type='text'
              placeholder='Search Products...'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </FormGroup>  
        </Col>
        <Col xs='auto'>
          <Button type='submit' variant="outline-success">Search</Button>  
        </Col>
      </Row>
    </Form>
  )
}

export default SearchBox;