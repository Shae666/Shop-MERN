import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  const handlePlaceOrder = () => {
    alert("✅ Order placed successfully!");
    navigate("/"); // redirect to home after checkout
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Checkout 💳</h1>
      {cart.length === 0 ? (
        <p>No items found for checkout.</p>
      ) : (
        <>
          <div className="checkout-items mb-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="checkout-item d-flex align-items-center mb-3 p-3 shadow-sm rounded"
              >
                <img src={item.img} alt={item.title} width="80" className="me-3 rounded" />
                <div className="flex-grow-1">
                  <h5>{item.title}</h5>
                  <p>
                    {item.qty} × ${(item.discountedPrice ?? item.price).toFixed(2)}
                  </p>
                </div>
                <strong>
                  ${(item.qty * (item.discountedPrice ?? item.price)).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <h4 className="text-end">Total: ${totalPrice}</h4>

          {/* Fake Checkout Form */}
          <div className="checkout-form mt-4 p-4 shadow-sm rounded bg-light">
            <h5>Billing Information</h5>
            <input type="text" placeholder="Full Name" className="form-control mb-3" />
            <input type="email" placeholder="Email" className="form-control mb-3" />
            <input type="text" placeholder="Address" className="form-control mb-3" />
            <input type="text" placeholder="City" className="form-control mb-3" />
            <input type="text" placeholder="Postal Code" className="form-control mb-3" />
            <input type="text" placeholder="Card Number" className="form-control mb-3" />

            <button className="btn btn-primary w-100" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
