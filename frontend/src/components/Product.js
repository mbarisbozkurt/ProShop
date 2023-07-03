import React from 'react'
import {Card} from "react-bootstrap"
import {Link} from 'react-router-dom'
import Rating from './Rating'

//props come from HomeScreen.js
const Product = ({product}) => {
  return (
    <Card className="my-3 p-3 rounded">

      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text>
          <Rating rating={product.rating} review={`${product.numReviews} reviews`} />
        </Card.Text>

        <Card.Text as="h3">
          ${product.price}
        </Card.Text>
      </Card.Body>

    </Card>
  )
}

export default Product

/* 
name={product.name}
img={product.image}
description={product.description}
price={product.price}
stock={product.countInStock}
rating={product.rating}
*/
