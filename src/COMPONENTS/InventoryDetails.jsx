import React, { useState, useEffect } from 'react';
import { showInventory } from '../Json/Db';
import './InventoryDetails.css';

const InventoryDetails = () => {
  const [inventoryData, setInventoryData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await showInventory(); 
      setInventoryData(response.data); 
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter out items with no quantity
  const filteredData = inventoryData.filter(item => item.Quantity > 0);

  return (
    <div className='inventoryDetails'>
      <h1>Inventory Details</h1>
      <table className='inventoryTable'>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td className="product-name">{item.pname}</td>
                <td className="quantity">{item.Quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-data">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryDetails;