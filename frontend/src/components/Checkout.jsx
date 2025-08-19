import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice } = location.state || { cart: [], totalPrice: 0 };

  // ✅ Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loadingCity, setLoadingCity] = useState(false);

  // ✅ Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Fetch City from Indian PIN
  const fetchCityFromPin = async (pin) => {
    if (pin.length !== 6) return; // check only when 6 digits
    setLoadingCity(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
        const cityName = data[0].PostOffice[0].District;
        setForm((prev) => ({ ...prev, city: cityName }));
        setErrors((prev) => ({ ...prev, postalCode: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          postalCode: "❌ Invalid PIN code",
        }));
        setForm((prev) => ({ ...prev, city: "" }));
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        postalCode: "⚠️ Failed to fetch city",
      }));
    }
    setLoadingCity(false);
  };

  // ✅ Validate Fields
  const validate = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.postalCode || form.postalCode.length !== 6)
      newErrors.postalCode = "Valid 6-digit PIN required";
    if (!form.city) newErrors.city = "City is required (check PIN)";
    if (!form.cardNumber || form.cardNumber.length < 12)
      newErrors.cardNumber = "Valid card number required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Place Order
  const handlePlaceOrder = () => {
    if (!validate()) return;
    alert("✅ Order placed successfully!");
    navigate("/");
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
                <img
                  src={item.img}
                  alt={item.title}
                  width="80"
                  className="me-3 rounded"
                />
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

          {/* ✅ Checkout Form */}
          <div className="checkout-form mt-4 p-4 shadow-sm rounded bg-light">
            <h5>Billing Information</h5>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="form-control mb-2"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-danger">{errors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-2"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-danger">{errors.email}</p>}

            <input
              type="text"
              name="address"
              placeholder="Address"
              className="form-control mb-2"
              value={form.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-danger">{errors.address}</p>}

            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code (6-digit)"
              className="form-control mb-2"
              value={form.postalCode}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value.length === 6) {
                  fetchCityFromPin(e.target.value);
                }
              }}
            />
            {loadingCity && <p>Fetching city...</p>}
            {errors.postalCode && <p className="text-danger">{errors.postalCode}</p>}

            <input
              type="text"
              name="city"
              placeholder="City"
              className="form-control mb-2"
              value={form.city}
              onChange={handleChange}
              readOnly
            />
            {errors.city && <p className="text-danger">{errors.city}</p>}

            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              className="form-control mb-3"
              value={form.cardNumber}
              onChange={handleChange}
            />
            {errors.cardNumber && <p className="text-danger">{errors.cardNumber}</p>}

            <button className="btn btn-primary w-100" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
