// src/pages/Home.jsx
import api from "../api/axios";
import { categoryImages } from "../data/categoryImages";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DealsOfTheDay from "../components/DealsOfTheDay";
import BestSellers from "../components/BestSellers";

const heroImages = [
  "/images/hero/Hero1.webp",
  "/images/hero/hero2.webp",
  "/images/hero/hero3.webp",
  "/images/hero/hero4.webp",
];

// 🔹 Step 2: CategoryBar Component
const CategoryBar = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories"); // backend API
        const categoriesWithImages = res.data.map((cat) => ({
          ...cat,
          image: categoryImages[cat.name] || "/images/category/default.png", // fallback image
        }));
        setCategories(categoriesWithImages);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white shadow-sm py-4 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-8 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className="flex flex-col items-center cursor-pointer hover:text-blue-600 transition"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-12 h-12 md:w-16 md:h-16 object-contain mb-2"
            />
            <span className="text-xs md:text-sm font-medium text-center">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Auto-slide every 2 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50">
      {/* 🔹 Category Section */}
      <CategoryBar />

      {/* 🔹 Hero Banner / Carousel */}
      <div className="mt-4 px-2 md:px-10">
        <div className="relative w-full h-40 sm:h-60 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <img
            src={heroImages[currentIndex]}
            alt="Hero Banner"
            className="w-full h-full object-cover transition-all duration-700"
          />

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  idx === currentIndex ? "bg-white" : "bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Deals of the Day */}
 <DealsOfTheDay />

      {/* 🔹 Product Grid */}
<BestSellers />
    </div>
  );
}
