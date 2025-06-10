import React from "react";
import { FiBox, FiGift, FiTruck, FiHeart, FiUserCheck } from "react-icons/fi";
import { MdOutlineFastfood } from "react-icons/md";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-[#f5faff] via-[#e9f3fc] to-[#f7faff]">
      {/* Heading */}
      <div className="flex items-center mb-2">
        <FiBox className="text-[#1769aa] mr-2" size={36} />
        <h2 className="text-3xl font-bold text-[#1769aa]">About Build-a-Box</h2>
      </div>
      {/* Description */}
      <p className="text-gray-700 text-lg max-w-2xl text-center mb-6">
        <b>Build-a-Box</b> lets you create your own snack box—handpick snacks, customize your box, and get it delivered anywhere. Perfect for gifting or self-treat!
      </p>
      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-6 w-full max-w-3xl">
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-5">
          <MdOutlineFastfood size={36} className="text-[#43addf] mb-2" />
          <span className="font-semibold text-[#1769aa] mb-1">Wide Snack Selection</span>
          <span className="text-gray-600 text-center text-sm">
            Choose from chips, chocolates, cookies, and more!
          </span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-5">
          <FiBox size={36} className="text-[#43addf] mb-2" />
          <span className="font-semibold text-[#1769aa] mb-1">Customizable Box</span>
          <span className="text-gray-600 text-center text-sm">
            Mix and match snacks to build your perfect box.
          </span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-5">
          <FiGift size={36} className="text-[#43addf] mb-2" />
          <span className="font-semibold text-[#1769aa] mb-1">Gift Option</span>
          <span className="text-gray-600 text-center text-sm">
            Send snack boxes as gifts with a custom note!
          </span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-5">
          <FiTruck size={36} className="text-[#43addf] mb-2" />
          <span className="font-semibold text-[#1769aa] mb-1">Fast Delivery</span>
          <span className="text-gray-600 text-center text-sm">
            Quick and safe delivery to your doorstep.
          </span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-5">
          <FiUserCheck size={36} className="text-[#43addf] mb-2" />
          <span className="font-semibold text-[#1769aa] mb-1">Easy to Use</span>
          <span className="text-gray-600 text-center text-sm">
            Simple, user-friendly box builder experience.
          </span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-5">
          <FiHeart size={36} className="text-pink-500 mb-2" />
          <span className="font-semibold text-[#1769aa] mb-1">Made with Love</span>
          <span className="text-gray-600 text-center text-sm">
            Every box is packed with care and happiness!
          </span>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-6 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Build-a-Box. All rights reserved.
      </div>
    </div>
  );
}
