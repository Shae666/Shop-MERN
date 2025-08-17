import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import sneakersimg from "../assets/shoe1.jpg";
import walletimg from "../assets/Wallet.png";
import watchimg from "../assets/watch.png";
import headphoneimg from "../assets/headphones.jpg";
import Boots from "../assets/Nike.png";
import hoodie from "../assets/hoodie.jpg";
import Navbar from "../components/Navbar";
import backpack from "../assets/backpack.jpg";
import cap from "../assets/cap.jpg";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [discountInputs, setDiscountInputs] = useState({});
  const [ratings, setRatings] = useState({});
  const [userRatings, setUserRatings] = useState({}); // store which products the current user rated

  const auth = JSON.parse(localStorage.getItem("auth_v1"));
  const user = auth?.user;
  const userEmail = user?.email;
  const isAdmin = user?.role === "admin";

  const products = [
    { id: 1, name: "Nike Air Jordan", price: 49.99, image: sneakersimg },
    { id: 2, name: "Leather Wallet", price: 29.99, image: walletimg },
    { id: 3, name: "LIGE Watch", price: 89.99, image: watchimg },
    { id: 5, name: "Marshall Headphones", price: 69.99, image: headphoneimg },
    { id: 4, name: "Nike Mercurial Superfly", price: 79.99, image: Boots },
    { id: 6, name: "Porshe Formula Team Cap", price: 99.99, image: cap },
    { id: 7, name: "Levi's Hoodie", price: 109.99, image: hoodie },
    { id: 8, name: "Shae's Backpack", price: 119.99, image: backpack },
  ];

  // Load data from localStorage
  useEffect(() => {
    if (!userEmail) return;

    const storedWishlist = JSON.parse(localStorage.getItem(`wishlist_${userEmail}`)) || [];
    const storedCart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    const storedDiscounts = JSON.parse(localStorage.getItem("discounts")) || {};
    const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    const storedUserRatings = JSON.parse(localStorage.getItem(`userRatings_${userEmail}`)) || {};

    setWishlist(storedWishlist);
    setCart(storedCart);
    setDiscounts(storedDiscounts);
    setRatings(storedRatings);
    setUserRatings(storedUserRatings);
  }, [userEmail]);

  const updateWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist_${userEmail}`, JSON.stringify(newWishlist));
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newCart));
  };

  const updateRatings = (newRatings) => {
    setRatings(newRatings);
    localStorage.setItem("ratings", JSON.stringify(newRatings));
  };

  const toggleWishlist = (product) => {
    if (!userEmail) return;

    const exists = wishlist.some((item) => item.productId === String(product.id));
    const finalPrice = discounts[product.id]
      ? parseFloat((product.price * (1 - discounts[product.id] / 100)).toFixed(2))
      : product.price;

    const newWishlist = exists
      ? wishlist.filter((item) => item.productId !== String(product.id))
      : [...wishlist, { productId: String(product.id), title: product.name, price: finalPrice, img: product.image }];

    updateWishlist(newWishlist);
  };

  const addToCart = (product) => {
    if (!userEmail) return;

    const exists = cart.some((item) => item.productId === String(product.id));
    const finalPrice = discounts[product.id]
      ? parseFloat((product.price * (1 - discounts[product.id] / 100)).toFixed(2))
      : product.price;

    const newCart = exists
      ? cart.map((item) =>
          item.productId === String(product.id)
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      : [...cart, { productId: String(product.id), title: product.name, price: finalPrice, img: product.image, qty: 1 }];

    updateCart(newCart);
  };

  const handleDiscountChange = (productId, value) => {
    setDiscountInputs({ ...discountInputs, [productId]: value });
  };

  const applyDiscount = (productId) => {
    const value = parseFloat(discountInputs[productId]);
    if (isNaN(value) || value < 0 || value > 100) return alert("Enter valid discount %");
    const newDiscounts = { ...discounts, [productId]: value };
    setDiscounts(newDiscounts);
    localStorage.setItem("discounts", JSON.stringify(newDiscounts));
    alert(`Discount ${value}% applied to product ID ${productId}`);
  };

  // Handle single rating per user
  const handleRating = (productId, value) => {
    if (userRatings[productId]) {
      alert("You have already rated this product!");
      return;
    }

    const current = ratings[productId] || { total: 0, count: 0 };
    const updatedRatings = {
      ...ratings,
      [productId]: { total: current.total + value, count: current.count + 1 }
    };
    updateRatings(updatedRatings);

    const updatedUserRatings = { ...userRatings, [productId]: true };
    setUserRatings(updatedUserRatings);
    localStorage.setItem(`userRatings_${userEmail}`, JSON.stringify(updatedUserRatings));
  };

  const resetRatings = () => {
    localStorage.removeItem("ratings");
    localStorage.removeItem(`userRatings_${userEmail}`);
    setRatings({});
    setUserRatings({});
    alert("All ratings have been reset!");
  };

  let filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  if (sortOption === "priceLowHigh") filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortOption === "priceHighLow") filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortOption === "nameAZ") filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <Navbar
        user={user}
        wishlist={wishlist}
        cart={cart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className={`hero-section text-center text-white d-flex flex-column justify-content-center align-items-center ${searchTerm ? "hero-shrink" : ""}`}>
        <h1>Welcome to ShopEasy</h1>
        <p>Find the best deals on your favorite items</p>
      </div>

      {isAdmin && (
        <div className="text-center my-3">
          <button className="btn btn-danger" onClick={resetRatings}>
            🔄 Reset All Ratings
          </button>
        </div>
      )}

      <div className="container my-5">
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isInWishlist = wishlist.some((item) => item.productId === String(product.id));
              const isInCart = cart.some((item) => item.productId === String(product.id));
              const discountedPrice = discounts[product.id]
                ? (product.price * (1 - discounts[product.id] / 100)).toFixed(2)
                : product.price.toFixed(2);

              const ratingData = ratings[product.id];
              const avgRating = ratingData ? (ratingData.total / ratingData.count).toFixed(1) : "0";
              const alreadyRated = userRatings[product.id];

              return (
                <div key={product.id} className="col-md-3 mb-4">
                  <div className="card h-100 shadow-sm product-card position-relative">
                    <img src={product.image} className="card-img-top" alt={product.name} />
                    <div className="card-body text-center">
                      <h5 className="card-title">{product.name}</h5>

                      <p className="card-text">
                        {discounts[product.id] ? (
                          <>
                            <span className="text-muted text-decoration-line-through me-2">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="fw-bold text-success">${discountedPrice}</span>
                            <span className="text-danger ms-1">(-{discounts[product.id]}%)</span>
                          </>
                        ) : (
                          <>${product.price.toFixed(2)}</>
                        )}
                      </p>

                      {/* Rating */}
                      <div className="rating mb-2">
                        {[1,2,3,4,5].map((star) => (
                          <span
                            key={star}
                            style={{ cursor: alreadyRated ? "not-allowed" : "pointer", fontSize: "1.2rem", color: avgRating >= star ? "#FFD700" : "#ccc" }}
                            onClick={() => !alreadyRated && handleRating(product.id, star)}
                          >
                            {avgRating >= star ? "⭐" : "☆"}
                          </span>
                        ))}
                        <div style={{ fontSize: "0.9rem", color: "gray" }}>
                          Avg: {avgRating} ({ratingData?.count || 0} ratings)
                        </div>
                      </div>

                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-light" onClick={() => toggleWishlist(product)}>
                          {isInWishlist ? "❤️" : "🤍"}
                        </button>
                        <button className="btn btn-primary" onClick={() => addToCart(product)}>
                          {isInCart ? "Added" : "Add to Cart"}
                        </button>
                      </div>

                      {isAdmin && (
                        <div className="mt-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Discount %"
                            className="form-control"
                            value={discountInputs[product.id] || ""}
                            onChange={(e) => handleDiscountChange(product.id, e.target.value)}
                          />
                          <button className="btn btn-warning mt-1" onClick={() => applyDiscount(product.id)}>
                            Apply Discount
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center text-white py-3 bg-dark">
        &copy; {new Date().getFullYear()} ShopEasy. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
