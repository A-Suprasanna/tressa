import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db, auth } from "../helpers/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;

      if (!user) {
        alert("Please login to view your cart.");
        navigate("/login");
        return;
      }

      try {
        const userCartRef = collection(db, "carts", user.uid, "items");
        const snapshot = await getDocs(userCartRef);
        const itemsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCartItems(itemsList);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleRemove = async (itemId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "carts", user.uid, "items", itemId));
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      alert("Item removed from cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item.");
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Function to clear cart after successful payment
  const clearCartAfterPayment = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userCartRef = collection(db, "carts", user.uid, "items");
      const snapshot = await getDocs(userCartRef);

      // Create a batch to delete all cart items in one operation
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();  // Execute batch delete
      console.log("Cart cleared after payment!");

      // Optionally, navigate to a payment success or order summary page
      navigate("/payment"); // Assuming you have an order summary page
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart after payment.");
    }
  };

  if (loading) return <div className="cart-page">Loading...</div>;

  if (cartItems.length === 0) {
    return <div className="cart-page">Your cart is empty!</div>;
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-image" />
            <div className="cart-details">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>Subtotal: ₹{item.price * item.quantity}</p>
              <button className="remove-btn" onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="total-section">
        <h3>Total: ₹{totalPrice}</h3>
        <button
          className="checkout-btn"
          onClick={() => {
            // Assuming this is the final checkout step and payment is processed here
            // Once payment is successful, clear the cart
            clearCartAfterPayment();  // Clear cart after payment
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;




