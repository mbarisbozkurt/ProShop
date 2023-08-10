import React from 'react'
import { useState, useEffect } from 'react'
import {Form, Row, FormGroup, FormLabel, FormControl, Button} from "react-bootstrap"
import { LinkContainer } from 'react-router-bootstrap';
import FormContainer from '../../components/FormContainer';

import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import { useParams } from 'react-router-dom';

const ProductEditScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(1);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  /////////////////////////////////////////////////////

  const {id: productId} = useParams(); //productId: id in the url
  //console.log(productId);
  const{data: product, isLoading, error, refetch} = useGetProductDetailsQuery(productId); //get the current product by using productId
  //console.log(product);

  //hangi ürünü editlemek için tıkladığında başlangıçta onun bilgilerini göstermek için
  useEffect(() => {
    if(product){
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  },[product])

  /////////////////////////////////////////////////////

  const [updateProduct] = useUpdateProductMutation(); //get the updateProduct function from productsApiSlice
  const navigate = useNavigate();
  //console.log(updateProduct)

  //refresh the page if there is a problem with editing products  
  const submitHandler = async(event) => {
    console.log("Hello");
    event.preventDefault();
    try {
      const updatedProduct = {productId, name, price, image, brand, countInStock, category, description}; //taken from the user with useState
      //console.log(updatedProduct)
      const result = await updateProduct(updatedProduct); //get the updated product from the backend
      if(result.error){
        toast.error(result.error);
      }else{
        toast.success("Product updated!");
        refetch();
        navigate("/admin/productlist");
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
   }

   const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

   const uploadFileHandler = async(event) => {
    //console.log(event.target.files[0]);
    //send the image to backend and get the response
    const formData = new FormData();
    formData.append("image", event.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    } 
   }

  return (
    <>
      <LinkContainer to={"/admin/productlist"}>
        <Button type='button' className='btn btn-light'>Go Back</Button>
      </LinkContainer>
    
      <FormContainer>
        <h1>Edit Product</h1>
        <Row>
          {isLoading && <Loader/>}
          {error && <Message variant="danger">{error?.data?.message || error?.error}</Message>}
          <Form onSubmit={submitHandler}>
              <FormGroup controlId='name' className='my-2'>
                <FormLabel>Name</FormLabel>
                <FormControl type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)}/>
              </FormGroup>

              <FormGroup controlId='price' className='my-2'>
                <FormLabel>Price</FormLabel>
                <FormControl type='number' placeholder='Enter price' value={price} onChange={(e) => setPrice(e.target.value)}/>
              </FormGroup>

              {/*Normal formgroup but 2 form control: 1 for type text: 1 for type file, and handle it in productApiSlice*/}
              {loadingUpload && <Loader/>}
              <FormGroup controlId='image' className='my-2'>
                <FormLabel>Image</FormLabel>
                <FormControl type="text" placeholder='Enter image url' value={image} onChange={(e) => setImage(e.target.value)} />
                <FormControl type="file" label="Choose file" onChange={uploadFileHandler}/> {/*handle with that after slice*/}
              </FormGroup>

              <FormGroup controlId='brand' className='my-2'>
                <FormLabel>Brand</FormLabel>  
                <FormControl type='text' placeholder='Enter brand' value={brand} onChange={(e) => setBrand(e.target.value)}/>
              </FormGroup>

              <FormGroup controlId='countInStock' className='my-2'>
                <FormLabel>Count In Stock</FormLabel>  
                <FormControl type='number' placeholder='Enter count in stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}/>
              </FormGroup>

              <FormGroup controlId='category' className='my-2'>
                <FormLabel>Category</FormLabel>  
                <FormControl type='text' placeholder='Enter category' value={category} onChange={(e) => setCategory(e.target.value)}/>
              </FormGroup>

              <FormGroup controlId='description' className='my-2'>
                <FormLabel>Description</FormLabel>  
                <FormControl type='text' placeholder='Enter description' value={description} onChange={(e) => setDescription(e.target.value)}/>
              </FormGroup>
              <Button type='submit' className='my-2'>Update</Button>
            </Form>
        </Row>
      </FormContainer>
    </>
  )
}

export default ProductEditScreen