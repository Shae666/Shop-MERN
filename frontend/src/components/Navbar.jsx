import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({
  user,
  wishlist,
  cart,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption
}) {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span className="navbar-brand fw-bold">ShopEasy</span>

      <div className="collapse navbar-collapse justify-content-center">
        <input
          type="text"
          className="form-control w-25 me-3"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-auto me-3"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="nameAZ">Name: A to Z</option>
        </select>
      </div>

      <div className="ms-auto d-flex align-items-center">
        <span className="text-white me-3">Hi, {user?.name || "User"}</span>

        {/* Wishlist */}
        <button
          className="btn btn-outline-light position-relative me-3"
          onClick={() => navigate("/wishlist")}
        >
          ❤️
          {wishlist.length > 0 && (
            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          className="btn btn-outline-light position-relative me-3"
          onClick={() => navigate("/cart")}
        >
          🛒
          {cart.length > 0 && (
            <span className="badge bg-success position-absolute top-0 start-100 translate-middle">
              {cart.length}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          className="btn btn-outline-light"
          onClick={() => {
            localStorage.removeItem("auth_v1");
            navigate("/"); // go to login
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
