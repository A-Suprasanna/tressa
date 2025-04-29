import React, { useEffect, useState } from "react";
import { db } from "../helpers/firebase";
import { collection, getDocs } from "firebase/firestore";
import "../styles/ProductList.css";

function ProductList () {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCol = collection(db, "products");
      const productSnapshot = await getDocs(productsCol);
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  return (
    <section>
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
          <p>{product.description}</p>
          <p className="price">₹ {product.Price}</p>
          <p className="rating">⭐⭐⭐⭐ {product.rating}</p>
        </div>
      ))}
    </div>
    </section>
  );
};

export default ProductList;
