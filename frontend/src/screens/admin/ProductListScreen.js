import React from 'react'
import { useDeleteProductMutation, useGetProductsQuery } from '../../slices/productsApiSlice';
import {Row, Col, Table, Button} from "react-bootstrap";
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { LinkContainer } from 'react-router-bootstrap';
import { useCreateProductMutation, } from '../../slices/productsApiSlice';
import {toast} from "react-toastify";

const ProductListScreen = () => {

  const {data: products, isLoading, error, refetch} = useGetProductsQuery();
  const [createProduct, {isLoading: loadingCreate}] = useCreateProductMutation();
  const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation();
  //console.log(products);

  const deleteHandler = async(id) => {
    if(window.confirm("Are you sure?")){
      try {
        const result = await deleteProduct(id).unwrap(); //unwrap backendden gelenleri işliyor (productController.js'deki deleteProduct fonksiyonundan gelen mesaj gibi)  
        toast.success(result.message); //comes from backend
        refetch(); //to update the products without refreshing the page
      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  }

  const createProductHandler = async() => {
    if(window.confirm("Are you sure?")){
      try {   
        await createProduct();
        refetch();

      } catch (error) {
        toast.error(error?.data?.message || error?.error);
      }
    }
  }
  
  return (    
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>

        <Col className='text-end'>
          <Button type="button" onClick={createProductHandler}> <FaPlus/> Create Product </Button>
        </Col>

        {loadingCreate && <Loader/>}
        {loadingDelete && <Loader/>}
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {isLoading && <Loader/>}
            {error && <Message variant="danger">{error?.data?.message || error?.error}</Message>}
            {products && products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button type='button' className='btn-md mx-2'><FaEdit/></Button> 
                  </LinkContainer>
                  
                  <Button type='button' variant='danger' onClick={() => deleteHandler(product._id)}><FaTrash style={{color: "white"}}/></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </>
  )
}

export default ProductListScreen;