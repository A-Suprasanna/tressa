import React, { useEffect, useState } from 'react';
import { db, auth } from "../helpers/firebase";
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import '../styles/OrderSummaryPage.css'; 

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'orders', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setOrders(userDocSnap.data().orders || []);
          } else {
            console.log('No orders found.');
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      } else {
        console.log('User not logged in.');
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="order-history-container">
      <h2>Your Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <h3>{order.productName}</h3>
              <p><strong>Price:</strong> ₹{order.productPrice}</p>

              <div className="order-section">
                <h4>Shipping Details:</h4>
                <p>{order.shippingDetails.fullName}</p>
                <p>{order.shippingDetails.address}, {order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.zipCode}</p>
              </div>

              <div className="order-section">
                <h4>Payment Method:</h4>
                <p>{order.paymentDetails.paymentMethod}</p>
              </div>

              <div className="order-section">
                <h4>Ordered On:</h4>
                <p>{new Date(order.created.seconds * 1000).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
