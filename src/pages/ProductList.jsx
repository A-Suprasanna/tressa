// src/pages/ProductList.js
import React, { useState, useEffect } from "react";
import { db } from "../helpers/firebase";
import { collection, getDocs } from "firebase/firestore";

const ProductList = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products"); // Your 'products' collection
        const snapshot = await getDocs(productsRef);
        const productsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="product-list" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product.id} style={{ width: "200px", textAlign: "center" }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "10px" }}
            />
            <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
            <p style={{ color: "#555" }}>₹{product.price}</p>
          </div>
        ))
      ) : (
        <p>No products found!</p>
      )}
    </div>
  );
};

export default ProductList;
