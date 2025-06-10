import React, { useState } from "react";

export default function GiftSubscriptionModal({ show, onClose, onGift }) {
  const [recipient, setRecipient] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [wrap, setWrap] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGift({ recipient, email, phone, address, wrap });
    onClose();
    setRecipient("");
    setEmail("");
    setPhone("");
    setAddress("");
    setWrap(false);
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 relative w-[350px]">
        <button
          className="absolute top-2 right-2 text-lg"
          onClick={onClose}
        >✕</button>
        <h2 className="text-xl font-bold mb-4">Gift This Box</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Recipient Name"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <input
            type="email"
            placeholder="Recipient Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <input
            type="tel"
            placeholder="Recipient Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <textarea
            placeholder="Delivery Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="border w-full p-2 mb-3 rounded"
            required
          />
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={wrap}
              onChange={e => setWrap(e.target.checked)}
              className="mr-2"
            />
            Gift wrapping (+₹50)
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Send Gift
          </button>
        </form>
      </div>
    </div>
  );
}
