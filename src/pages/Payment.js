import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import '../styles/PaymentPage.css';
import { db, auth } from "../helpers/firebase";
import { doc, updateDoc, setDoc,Timestamp, getDoc, arrayUnion } from 'firebase/firestore';


const PaymentPage = () => {
  const navigate = useNavigate();
  const product =  JSON.parse(localStorage.getItem('orderedProduct')) || [];
  

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    upiId: '',
    bankSelection: ''
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName) tempErrors.fullName = 'Full name is required';
    if (!emailRegex.test(formData.email)) tempErrors.email = 'Valid email is required';
    if (!formData.address) tempErrors.address = 'Address is required';
    if (!formData.city) tempErrors.city = 'City is required';
    if (!formData.state) tempErrors.state = 'State is required';
    if (formData.zipCode.length !== 6) tempErrors.zipCode = 'Zip code must be 6 digits';
    if (!formData.paymentMethod) tempErrors.paymentMethod = 'Select payment method';

    if (formData.paymentMethod === 'card') {
      if (formData.cardNumber.length !== 16) tempErrors.cardNumber = 'Card number must be 16 digits';
      if (!/^(0?[1-9]|1[0-2])$/.test(formData.expMonth)) tempErrors.expMonth = 'Enter valid month';
      if (!/^\d{4}$/.test(formData.expYear)) tempErrors.expYear = 'Enter valid year';
      if (!/^\d{3}$/.test(formData.cvv)) tempErrors.cvv = 'Enter valid CVV';
    } else if (formData.paymentMethod === 'upi') {
      if (!formData.upiId) tempErrors.upiId = 'UPI ID is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const user = auth.currentUser;
    
    if (!user) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }
    
  
    try {
      const userDocRef = doc(db, 'orders', user.uid);
  
      const userDocSnap = await getDoc(userDocRef);
  
      const newOrder = {
        productName: product?.name || '',
        productPrice: product?.price || '',
        created: Timestamp.now(),
        shippingDetails: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentDetails: {
          paymentMethod: formData.paymentMethod,
          cardNumber: formData.cardNumber,
          upiId: formData.upiId,
          bankSelection: formData.bankSelection
        }
      };
  
      if (userDocSnap.exists()) {
        await updateDoc(userDocRef, {
          orders: arrayUnion(newOrder)
        });
      } else {
        await setDoc(userDocRef, {
          orders: [newOrder]
        });
      }
  
      setShowModal(true);
      setFormData({
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: '',
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvv: '',
        upiId: '',
        bankSelection: ''
      });
  
      setTimeout(() => {
        setShowModal(false);
        navigate('/ordersummary');
      }, 2500);
  
    } catch (err) {
      console.error('Error saving order:', err);
    }
  };
  

  return (
    <div className="container">
      
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2>Buying: {product.name}</h2>
          <p>Price: ₹{product.price}</p>
          <img src={product.imageUrl} alt={product.name} style={{ width: "200px", borderRadius: "10px" }} />
        </div>
      

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            {['fullName', 'email', 'address', 'city', 'state', 'zipCode'].map((field, idx) => (
              <div className="inputBox" key={idx}>
                <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} :</span>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
                {errors[field] && <div className="error-message">{errors[field]}</div>}
              </div>
            ))}
          </div>

          <div className="col payment">
            <div className="inputBox">
              <span>Select Payment Method:</span>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                <option value="">Choose payment method</option>
                <option value="card">Credit/Debit Card</option>
                <option value="net-banking">Net Banking</option>
                <option value="upi">UPI</option>
                <option value="cod">Cash on Delivery</option>
              </select>
              {errors.paymentMethod && <div className="error-message">{errors.paymentMethod}</div>}
            </div>

            {formData.paymentMethod === 'card' && (
              ['cardNumber', 'expMonth', 'expYear', 'cvv'].map((field, idx) => (
                <div className="inputBox" key={idx}>
                  <span>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} :</span>
                  <input type="text" name={field} value={formData[field]} onChange={handleChange} />
                  {errors[field] && <div className="error-message">{errors[field]}</div>}
                </div>
              ))
            )}

            {formData.paymentMethod === 'upi' && (
              <div className="inputBox">
                <span>UPI ID :</span>
                <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} />
                {errors.upiId && <div className="error-message">{errors.upiId}</div>}
              </div>
            )}

            {formData.paymentMethod === 'net-banking' && (
              <div className="inputBox">
                <span>Choose Your Bank :</span>
                <select name="bankSelection" value={formData.bankSelection} onChange={handleChange}>
                  <option value="">Choose bank</option>
                  <option value="Indian Bank">Indian Bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="IOB">Indian Overseas Bank</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <input type="submit" value="Submit" className="submit-btn" />
      </form>

      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <img src="https://static.wixstatic.com/media/3ad450_ffe60bd6ab114199b50bed5a9efde163~mv2.gif" alt="Success" height="200" width="200" />
            <div className="modal-header">Payment Successful!</div>
            <div className="modal-body">
              Your order has been placed successfully. Redirecting to home page...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
