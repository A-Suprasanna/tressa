// CategoriesList.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/CategoriesPage.css";

const categories = [
  {
    id: 1,
    name: "Winter wear",
    imageUrl: "https://us.123rf.com/450wm/irinatimokhina/irinatimokhina1711/irinatimokhina171100067/89671245-young-beautiful-girl-in-hat-and-mittens-drinking-hot-tea-from-a-thermos-in-the-winter-christmas.jpg?ver=6",
    route: "/winters"
  },
  {
    id: 2,
    name: "Traditional dresses",
    imageUrl: "https://i.pinimg.com/736x/be/af/e0/beafe0d99550b2dd50421743238f94ef.jpg",
    route: "/traditionals"
  },
  {
    id: 3,
    name: "Ethnic wear",
    imageUrl: "https://images.meesho.com/images/products/396932991/hfxtc_512.webp",
    route: "/ethnics"
  },
  {
    id: 4,
    name: "Casual wear",
    imageUrl: "https://www.hayclothing.in/cdn/shop/files/DSC08896.webp?v=1742455665&width=1100",
    route: "/casuals"
  },
  {
    id: 5,
    name: "Party wear",
    imageUrl: "https://mahezon.in/cdn/shop/files/IMG-20240227_221241_441_800x1026_crop_center@2x.jpg?v=1709053222",
    route: "/parties"
  },
  {
    id: 6,
    name: "Formal wear",
    imageUrl: "https://i.pinimg.com/736x/7e/fb/29/7efb290d4360b272e62cb297fec90a02.jpg",
    route: "/formals"
  }
];

const CategoriesList = () => {
  return (
    <div className="categories-page">
      <h2>Explore Our Categories</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <Link to={cat.route}>
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="category-image"
                />
              ) : (
                <div className="placeholder">No image available</div>
              )}
              <h3>{cat.name}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
