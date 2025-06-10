import React from "react";
import { FiMail, FiPhone, FiMapPin, FiMessageCircle, FiHeadphones } from "react-icons/fi";

export default function Contact() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-[#f5faff] via-[#e9f3fc] to-[#f7faff]">
      {/* Heading with Icon */}
      <div className="flex items-center mb-2 mt-8">
        <FiHeadphones className="text-[#1769aa] mr-2" size={32} />
        <h2 className="text-3xl font-bold text-[#1769aa]">Contact Us</h2>
      </div>
      <p className="text-gray-700 text-lg max-w-2xl text-center mb-6">
        Have a question, suggestion, or need support? We're here for you!
      </p>
      {/* Contact Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 w-full max-w-2xl">
        <div className="flex items-center bg-white rounded-xl shadow p-5">
          <FiMail size={28} className="text-[#43addf] mr-4" />
          <div>
            <div className="font-semibold text-[#1769aa]">Email</div>
            <div className="text-gray-700 text-sm">support@buildabox.com</div>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-xl shadow p-5">
          <FiPhone size={28} className="text-[#43addf] mr-4" />
          <div>
            <div className="font-semibold text-[#1769aa]">Phone</div>
            <div className="text-gray-700 text-sm">+91 98765 43210</div>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-xl shadow p-5">
          <FiMapPin size={28} className="text-[#43addf] mr-4" />
          <div>
            <div className="font-semibold text-[#1769aa]">Address</div>
            <div className="text-gray-700 text-sm">123 Snack Street, Food City, India</div>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-xl shadow p-5">
          <FiMessageCircle size={28} className="text-[#43addf] mr-4" />
          <div>
            <div className="font-semibold text-[#1769aa]">Feedback & Suggestions</div>
            <div className="text-gray-700 text-sm">We love to hear your ideas!</div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-gray-500 text-sm mb-8">
        We'll respond as soon as possible!
      </div>
    </div>
  );
}
