import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from "../helpers/firebase"; 
import '../styles/ContactPage.css';

import redDress from '../assets/RedDress.webp';
import yellowDress from '../assets/YellowDress.webp';
import purpleDress from '../assets/PurpleDress.avif';
import blackDress from '../assets/BlackDress.webp';

const dressImages = [
  { id: 1, src: redDress, alt: 'Elegant red evening dress' },
  { id: 2, src: yellowDress, alt: 'Bright yellow summer dress' },
  { id: 3, src: purpleDress, alt: 'Royal purple cocktail dress' },
  { id: 4, src: blackDress, alt: 'Classic black formal dress' }
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacyConsent: false
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.privacyConsent) {
      setSubmissionStatus('consent-error');
      return;
    }

    setIsLoading(true);
    
    try {
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        privacyConsent: true,
        status: 'new',
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, "contactSubmissions"), submissionData);
      
      setSubmissionStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        privacyConsent: false
      });
    } catch (error) {
      console.error("Error saving contact form:", error);
      setSubmissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='contact-page-container'>
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contact Our Fashion Team</h1>
        <p>Have questions about our dresses or need styling advice? We're here to help!</p>
      </header>

      <div className="contact-container">
        <div className="dress-gallery">
          {dressImages.map(dress => (
            <div key={dress.id} className="dress-image-container">
              <img 
                src={dress.src} 
                alt={dress.alt} 
                className="dress-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x400?text=Dress+Image';
                }}
              />
            </div>
          ))}
        </div>

        <div className="contact-content">
          {submissionStatus === 'success' && (
            <div className="success-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <p>Thank you for your message! Our fashion team will respond within 24 hours.</p>
            </div>
          )}

          {submissionStatus === 'error' && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>We couldn't send your message. Please try again later.</p>
            </div>
          )}

          {submissionStatus === 'consent-error' && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p>Please agree to our privacy policy before submitting.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <h2>Send Us a Message</h2>
            
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name*"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="2"
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address*"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select Inquiry Type*</option>
                <option value="Order Help">Order Help</option>
                <option value="Returns & Exchanges">Returns & Exchanges</option>
                <option value="Size Consultation">Size Consultation</option>
                <option value="Product Question">Product Question</option>
                <option value="Wedding/Special Occasion">Wedding/Special Occasion</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your Message* (Minimum 30 characters)"
                value={formData.message}
                onChange={handleChange}
                required
                minLength="30"
                rows="6"
              />
            </div>
            
            <div className="privacy-consent">
              <input
                type="checkbox"
                id="privacyConsent"
                name="privacyConsent"
                checked={formData.privacyConsent}
                onChange={handleChange}
                required
              />
              <label htmlFor="privacyConsent">
                I agree to the privacy policy and terms of service*
              </label>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>

          <div className="contact-info">
            <h3>Elegance & Attention</h3>
            
            <div className="info-item">
              <svg viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <div>
                <h4>Email Us</h4>
                <a href="mailto:suprasanna2006@gmail.com">suprasanna2006@gmail.com</a>
              </div>
            </div>
            
            <div className="info-item">
              <svg viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
              <div>
                <h4>Call Us</h4>
                <a href="tel:+15551234567">+91 1234567895</a>
                <p>Mon-Fri: 9AM-6PM EST</p>
              </div>
            </div>
            
            <div className="info-item">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <div>
                <h4>Visit Us</h4>
                <address>
                  Freshworks software academy<br />
                  Global infocity park<br />
                  India
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactPage;