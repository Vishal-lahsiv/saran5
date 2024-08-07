import React, { useState, useContext } from 'react';
import { Context } from './GlobeData';
import { addProductToInventory } from '../Json/Db';
import { v4 as uuidv4 } from 'uuid';
import './AddProduct.css';

const AddProduct = () => {
  const { isAdmin } = useContext(Context);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || quantity <= 0) {
      alert("Please enter a valid product name and quantity.");
      return;
    }

    const newProduct = {
      id: uuidv4(),
      pname: productName,
      Quantity: parseInt(quantity, 10),
    };

    try {
      await addProductToInventory(newProduct);
      alert("Product added successfully!");
      setProductName('');
      setQuantity('');
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  if (!isAdmin) {
    return <p>You do not have permission to add products.</p>;
  }

  return (
    <div className="addProductForm">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
