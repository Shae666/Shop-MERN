import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";

export default function Cart({ updateCartCount }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const auth = JSON.parse(localStorage.getItem("auth_v1"));
  const user = auth?.user;
  const userEmail = user?.email;

  // Load cart from localStorage
  useEffect(() => {
    if (!userEmail) return;
    const storedCart =
      JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    setCart(storedCart);
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
    if (qty < 1) return;
    const newCart = cart.map((item) =>
      item.productId === productId ? { ...item, qty } : item
    );
    updateCartStorage(newCart);
  };

  // Calculate total price using discountedPrice if available
  const totalPrice = cart
    .reduce(
      (sum, item) =>
        sum + (item.discountedPrice ?? item.price) * item.qty,
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
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/Home")}
      >
        ← Back to Home
      </button>

      <h1 className="mb-4">Your Cart 🛒</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="cart-item d-flex align-items-center mb-3 p-3 shadow-sm rounded"
            >
              <img
                src={item.img}
                alt={item.title}
                width="100"
                className="me-3 rounded"
              />
              <div className="flex-grow-1">
                <h5>{item.title}</h5>
                <p>${(item.discountedPrice ?? item.price).toFixed(2)}</p>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={item.qty}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.productId,
                      parseInt(e.target.value)
                    )
                  }
                  className="form-control w-50"
                />
              </div>
              <button
                className="btn btn-danger ms-3"
                onClick={() => handleRemove(item.productId)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-end mt-4">
            <h4>Total: ${totalPrice}</h4>
            <button
              className="btn btn-success mt-2"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
