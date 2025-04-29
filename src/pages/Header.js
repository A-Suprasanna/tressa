import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../helpers/firebase";
import logo from "../assets/logo.jpg";

function Header() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  const collections = [
    "CasualWear",
    "EthnicWear",
    "FormalWear",
    "PartyWear",
    "WinterCollectionPage",
    "TraditionalCollectionPage",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length === 0) {
      setSearchResults([]);
      return;
    }

    let results = [];

    for (const col of collections) {
      const colRef = collection(db, col);
      const colSnapshot = await getDocs(colRef);

      colSnapshot.forEach((doc) => {
        const data = doc.data();
        // Assume your product has 'name' field to search
        if (data.name?.toLowerCase().includes(term)) {
          results.push({ ...data, id: doc.id, category: col });
        }
      });
    }

    setSearchResults(results);
  };

  const handleSelectProduct = (product) => {
    // Navigate to product details page
    localStorage.setItem("orderedProduct", JSON.stringify(product));
    navigate("/payment");
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <header className="navbar">
      {user && (
        <div >
          <div  style={{ display: "flex", alignItems: "center",gap: "10px" }}>
            <img
              src={logo}
              alt="Logo"
              className="logo"
              onClick={() => navigate("/")}
            />
            <div style={{display:"flex",flexDirection:"column"}} >
            <span>Welcome, {user.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
            </div>
          </div>
          
         
          
        </div>
      )}

      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((product, index) => (
                <div
                  key={index}
                  className="search-item"
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-category">{product.category}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">No matching products found.</div>
            )}
          </div>
        )}
      </div>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/ordersummary">Order Summary</Link>
        <Link to="/contact">Contact Us</Link>
        {!user && (
          <Link to="/login" className="Login">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
