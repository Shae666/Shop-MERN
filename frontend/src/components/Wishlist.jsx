import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Wishlist.css";

export default function Wishlist({ updateWishlistCount }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const auth = JSON.parse(localStorage.getItem("auth_v1"));
  const user = auth?.user;
  const userEmail = user?.email;

  // Load wishlist from localStorage
  useEffect(() => {
    if (!userEmail) return;
    const storedWishlist =
      JSON.parse(localStorage.getItem(`wishlist_${userEmail}`)) || [];
    setWishlist(storedWishlist);
  }, [userEmail]);

  const updateWishlistStorage = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(newWishlist));
    updateWishlistCount(newWishlist.length); // update navbar instantly
  };

  const handleRemove = (productId) => {
    const newWishlist = wishlist.filter((item) => item.productId !== productId);
    updateWishlistStorage(newWishlist);
  };

  return (
    <div className="container my-5">
      {/* Back to Home button */}
      <div className="mb-3">
        <button className="btn btn-secondary" onClick={() => navigate("/Home")}>
          ← Back to Home
        </button>
      </div>

      <h1 className="mb-4">Your Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <div className="text-center my-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4207/4207243.png"
            alt="Empty Wishlist"
            style={{ width: "120px", opacity: 0.7 }}
          />
          <h3 className="mt-3">Your wishlist is empty 💔</h3>
          <p className="text-muted">
            Start adding items you love and save them here.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/Home")}
          >
            Browse Products →
          </button>
        </div>
      ) : (
        <div className="row">
          {wishlist.map((item) => (
            <div key={item.productId} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm product-card position-relative">
                <img
                  src={item.img}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{item.title}</h5>
                  <p>${item.price.toFixed(2)}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
