import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateInventory, getInventoryData } from '../Json/Db';
import { Context } from './GlobeData';
import './Products.css';

const Products = () => {
  const { updateQuantities } = useContext(Context);
  const navigate = useNavigate();

  const [counts, setCounts] = useState({});
  const [products, setProducts] = useState([]);

  const fetchInventoryData = async () => {
    const data = await getInventoryData();
    setProducts(data);
    const initialCounts = data.reduce((acc, item) => {
      acc[item.pname] = item.Quantity || 0;
      return acc;
    }, {});
    setCounts(initialCounts);
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleInputChange = (product, value) => {
    if (value === '' || /^[0-9]+$/.test(value)) {
      const numericValue = value === '' ? 0 : parseInt(value, 10);
      setCounts((prevCounts) => ({
        ...prevCounts,
        [product.pname]: numericValue,
      }));
    }
  };

  const handleSave = async (product) => {
    const updatedProduct = {
      id: product.id,
      pname: product.pname,
      Quantity: counts[product.pname] || 0,
    };
    await updateInventory(product.id, updatedProduct);
    await fetchInventoryData(); // Refresh data to include updated quantities
    navigate('/Inventory');
  };

  return (
    <div className='products'>
      <h1>Products In Inventory</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={index}>
                <td>{product.pname}</td>
                <td>
                  <div className='quantityControl'>
                    <input 
                      type="text"
                      value={counts[product.pname] || 0} 
                      onChange={(e) => handleInputChange(product, e.target.value)}
                    />
                  </div>
                </td>
                <td>{product.category || 'Uncategorized'}</td>
                <td>
                  <button onClick={() => handleSave(product)}>Save</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
