import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

export default function Cart({ updateCartCount }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const auth = JSON.parse(localStorage.getItem("auth_v1"));
  const user = auth?.user;
  const userEmail = user?.email;

  // Load cart from localStorage and ensure qty is at least 1
  useEffect(() => {
    if (!userEmail) return;
    const storedCart =
      JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];

    const initializedCart = storedCart.map((item) => ({
      ...item,
      qty: item.qty || 1,
    }));

    setCart(initializedCart);
  }, [userEmail]);

  const updateCartStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newCart));
    updateCartCount(newCart.length); // update navbar instantly
  };

  const handleRemove = (productId) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    updateCartStorage(newCart);
  };

  const handleQuantityChange = (productId, qty) => {
    qty = parseInt(qty) || 1; // fallback to 1 if NaN
    if (qty < 1) qty = 1; // prevent going below 1
    const newCart = cart.map((item) =>
      item.productId === productId ? { ...item, qty } : item
    );
    updateCartStorage(newCart);
  };

  // Calculate total price using discountedPrice if available
  const totalPrice = cart
    .reduce(
      (sum, item) => sum + (item.discountedPrice ?? item.price) * item.qty,
      0
    )
    .toFixed(2);

  // Handle checkout navigation
  const handleCheckout = () => {
    navigate("/checkout", { state: { cart, totalPrice } }); // pass cart + total to checkout
  };

  return (
    <div className="container my-5">
      {/* Back to Home button */}
      <button
        className="btn btn-outline-dark mb-4"
        onClick={() => navigate("/Home")}
      >
        ← Continue Shopping
      </button>

      <div className="row">
        {/* Cart Items Section */}
        <div className="col-lg-8">
          <h2 className="fw-bold mb-4">Your Shopping Cart 🛒</h2>
          {cart.length === 0 ? (
            <div className="text-center my-5">
              <img
                src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                alt="Empty Cart"
                style={{ width: "140px", opacity: 0.7 }}
              />
              <h3 className="mt-3">Your cart is empty 🛍️</h3>
              <p className="text-muted">
                Looks like you haven’t added anything yet.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/Home")}
              >
                Start Shopping →
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="cart-item card mb-3 shadow-sm border-0"
              >
                <div className="row g-0 align-items-center p-3">
                  <div className="col-md-3 text-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="img-fluid rounded"
                      style={{ maxHeight: "120px" }}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="fw-semibold">{item.title}</h5>
                    <p className="text-muted small mb-1">
                      Price: $
                      {(item.discountedPrice ?? item.price).toFixed(2)}
                    </p>
                    <p className="fw-semibold">
                      Subtotal: $
                      {(
                        (item.discountedPrice ?? item.price) * item.qty
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div className="col-md-3 d-flex flex-column align-items-end">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, e.target.value)
                      }
                      className="form-control w-75 mb-2"
                    />
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary Section */}
        {cart.length > 0 && (
          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0 p-4 sticky-top"
              style={{ top: "100px" }}
            >
              <h4 className="fw-bold mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cart.length})</span>
                <span>
                  $
                  {cart
                    .reduce(
                      (sum, item) =>
                        sum + (item.discountedPrice ?? item.price) * item.qty,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              <button
                className="btn btn-success w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
