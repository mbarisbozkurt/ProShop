import React, { useState } from 'react'
import {Row, Col, Button, Dropdown} from "react-bootstrap"
// import products from '../products'
import Product from '../components/Product'
import { useGetProductsQuery, useGetProductsAscendingQuery, useGetProductsDescendingQuery} from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import { LinkContainer } from 'react-router-bootstrap'
import ProductCarousel from "../components/ProductCarousel"
import Meta from '../components/Meta'

const HomeScreen = () => {

  const [isAscending, setIsAscending] = useState(false);
  const [isDescending, setIsDescending] = useState(false); 
  console.log(isAscending); console.log(isDescending);

  const {keyword, pageNumber} = useParams(); //keyword: get whatever is written in the SearchBox form, pageNumber: comes from the url
  //console.log(keyword); //console.log(pageNumber);

  const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber}); //make a query for http://localhost:5000/api/products and get the data by using keyword
  //console.log(data.products);

  const{data: ascendingData, isLoading: ascendingLoading} = useGetProductsAscendingQuery({pageNumber});
  const{data: descendingData, isLoading: descendingLoading} = useGetProductsDescendingQuery({pageNumber});
  //console.log(ascendingData.page);
  //console.log(ascendingData.pages);
  
  return (
   <> 
      {isLoading ? <Loader/> : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
         <>
            {data.products.length !== 0 && //if there is a product that user searched for and if there is a keyword that searched
               <> 
                  {keyword &&
                     <LinkContainer to={"/"}>
                        <Button className='btn btn-light'>Go Back</Button>
                     </LinkContainer>
                  }
                  
                  {!keyword &&
                     <ProductCarousel/>
                  }
                  
                  <Meta/>
                  
                  <Row>
                     <Col>
                        <h1 className='my-3'>Latest Products</h1> 
                     </Col>

                     <Col md={9}>
                        <Dropdown className='my-3'>
                           <Dropdown.Toggle variant="primary" id="dropdown">
                              Sort Products by Price
                           </Dropdown.Toggle>

                           <Dropdown.Menu>
                              <Dropdown.Item onClick={() => {setIsAscending(true); setIsDescending(false);}}> In Ascending Order </Dropdown.Item>
                              <Dropdown.Item onClick={() => {setIsAscending(false); setIsDescending(true);}}> In Descending Order </Dropdown.Item>
                              <Dropdown.Item onClick={() => window.location.reload()}>Randomly</Dropdown.Item>
                           </Dropdown.Menu>
                        </Dropdown>
                     </Col>
                  </Row>

                  {/*Sorted in ascending order by price*/}
                  <Row>
                     {ascendingLoading && <Loader/>}
                     {isAscending && ascendingData.products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                           <Product product={product}/>
                        </Col>
                     ))} 
                  </Row>

                  {isAscending &&
                     <Row className="my-4" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Col xs={12} md={1}>
                           <Paginate pages={ascendingData.pages} page={ascendingData.page}/>
                        </Col>
                     </Row>
                  }

                  {/*Sorted in descending order by price*/}
                  <Row>
                     {descendingLoading && <Loader/>}
                     {isDescending && descendingData.products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                           <Product product={product}/>
                        </Col>
                     ))} 
                  </Row>

                  {isDescending && 
                     <Row className="my-4" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Col xs={12} md={1}>
                           <Paginate pages={descendingData.pages} page={descendingData.page}/>
                        </Col>
                     </Row>
                  }
                  
                  {/*Not sorted - normal*/}
                  <Row>
                     {!isAscending && !isDescending && data.products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                           <Product product={product}/>
                        </Col>
                     ))} 
                  </Row>
                  
                  {!isAscending && !isDescending &&
                     <Row className="my-4" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Col xs={12} md={1}>
                           <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ""}/>
                        </Col>
                     </Row>
                  }
               </>
            }

            {data.products.length === 0 && //if there is no product that user searched for 
               <>
                  <h1 className='my-3'>Product Not Found</h1>
                  <LinkContainer to={"/"}>
                     <Button className='btn btn-light'>Go Back</Button>
                  </LinkContainer>
               </>
            }
         </>)}    
   </>
  )
}

//if proxy error exists, run the server again

export default HomeScreen;