import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../helpers/firebase'; // Assuming Firebase is set up
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/SearchBar.css'; // Add your CSS styles

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Handle input changes in the search bar
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle the search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        // Query the products collection in Firebase based on the search term
        const q = query(collection(db, 'products'), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Redirect to the search results page, passing the products list
        navigate('/search-results', { state: { products } });
      } catch (error) {
        console.error('Error searching for products:', error);
      }
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
