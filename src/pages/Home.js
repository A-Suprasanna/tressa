import React from "react";
import ProductList from "../pages/ProductList"; 
import { Link } from "react-router-dom"; 
import "../App.css"

function Home() {
  return (
    <main className="main-content">
      <section className="left-section">
        <p className="subtitle">Transform and Redefine Your Wardrobe</p>
        <h1 className="title">Elevate Your Wardrobe</h1>
        <p className="description">
          Embrace the harmony of style and elegance. Explore our latest designs and
          discover the outfit that becomes your statement of confidence.
        </p>
        <Link to="/categories">
        <button className="cta-button">Enjoy</button>
        </Link>
        <div className="tag-line">Elegance & Attention</div>
      </section>
      <section className="right-section">
        <ProductList />
      </section>
    </main>
  );
}

export default Home;


