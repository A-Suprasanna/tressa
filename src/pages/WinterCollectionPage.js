import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../helpers/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/CategoryProducts.css";

const WinterCollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "WinterCollectionPage"));
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);

        const initialQuantities = {};
        productsList.forEach((product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Error fetching WinterCollectionPage products:", err);
        setError("Failed to load WinterCollectionPage products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (e,id) => {
    const {name} = e.target;
    const delta = {
      increment:1, decrement:-1
    }
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] + delta[name]),
    }));
  };

  const addToCart = async (product) => {
    const quantity = quantities[product.id] || 1;
    const user = auth.currentUser; // Get the current logged-in user

    if (!user) {
      alert("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    try {
      const cartItem = {
        ...product,
        quantity,
      };

      const userCartRef = collection(db, "carts", user.uid, "items");
      await addDoc(userCartRef, cartItem);

      alert(`${product.name} added to your cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const buyNow = (product) => {
    const quantity = quantities[product.id] || 1;
    const order = { ...product, quantity };
    localStorage.setItem("orderedProduct", JSON.stringify(order));
    navigate("/payment");
  };

  if (loading) return <div className="category-products-page">Loading...</div>;
  if (error) return <div className="category-products-page">{error}</div>;

  return (
    <div className="category-products-page">
      <h2>Traditional Collection</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">₹{product.price}</p>
            <div className="quantity-controls">
              <button
                name="decrement"
                onClick={(e)=>handleQuantityChange(e,product.id)}
              >
                -
              </button>
              <span>{quantities[product.id]}</span>
              <button
                name="increment"
                onClick={(e)=>handleQuantityChange(e,product.id)}
              >
                +
              </button>
            </div>
            <button
              className="add-to-cart-button"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button className="buy-now-button" onClick={() => buyNow(product)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinterCollectionPage;
