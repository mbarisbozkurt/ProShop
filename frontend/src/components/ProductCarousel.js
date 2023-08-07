import React from 'react'
import { Carousel, Image } from 'react-bootstrap';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';

const ProductCarousel = () => {
  const{data: topProducts} = useGetTopProductsQuery();

  return (
    <Carousel pause="hover" className='mb-4'> 
      {topProducts && topProducts.map((product) => (
        <Carousel.Item key={product._id} style={{backgroundColor: "#445069"}}>  {/*322653  445069 7b8a8b*/} 
            <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid/> {/*className="d-block w-50"*/}
              <Carousel.Caption className='carousel-caption'>
                <h2>{product.name}</h2>
                <h2>${product.price}</h2>
              </Carousel.Caption>
            </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel