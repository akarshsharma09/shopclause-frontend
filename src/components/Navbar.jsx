import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar({ user, onLoginClick, onLogout }) {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ fixed undefined error
  const profileRef = useRef();
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) {
      // ✅ Always go to All Products page with search param
      navigate(`/categories/all?search=${encodeURIComponent(search)}`);
    }
  };

  // Redux cart state
  const { cartItems, totalQuantity } = useSelector((state) => state.cart);

  // Cart item count
  const cartCount =
    totalQuantity ||
    (cartItems
      ? cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0)
      : 0);

  // Display Name (name > email prefix > User)
  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "User";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout(); // ✅ call App.jsx logout
    setProfileDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="w-full shadow-md border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="https://cdn.shopclues.com/images/ui/shopclues_logo@2x.png"
            alt="ShopClues"
            className="h-6 sm:h-8"
          />
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-6">
          <input
            type="text"
            placeholder="What is on your mind today?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border rounded-l-md px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 rounded-r-md hover:opacity-90 transition"
          >
            Search
          </button>
        </div>

        {/* Right - Icons & Auth */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <div className="flex flex-col items-center cursor-pointer hover:text-black">
            <span className="text-xs">Share</span>
            <span className="text-[11px] text-blue-500">Location</span>
          </div>

          <button className="hover:text-black" aria-label="Notifications">
            <Bell size={20} />
          </button>

          <button
            onClick={() => navigate("/wishlist")} // 👈 isko button ke attribute me rakho
            className="relative hover:text-black"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          <div
            className="relative cursor-pointer hover:text-black"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Auth Buttons / Profile Dropdown */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-3 text-gray-700 hover:text-black focus:outline-none"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={profileDropdownOpen}
              >
                <User size={20} />
                <span className="hidden sm:inline-block">{displayName}</span>
                <ChevronDown size={16} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute ml-2px mt-4 w-48 bg-white border rounded-md shadow-lg z-50">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/profile");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/orders");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    My Orders
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/settings");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Settings
                  </button>

                     <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      navigate("/contact");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    Contact Us
                  </button>

                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="hover:text-black flex items-center gap-1"
              onClick={onLoginClick}
              aria-label="Sign In"
            >
              <User size={20} /> Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setProfileDropdownOpen(false);
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 pt-4 bg-white border-t shadow-md">
          {/* Mobile Search */}
          <div className="flex mb-2">
            <input
              type="text"
              placeholder="What is on your mind today?"
              value={search} // ✅ bind state
              onChange={(e) => setSearch(e.target.value)} // ✅ controlled input
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ enter key
              className="flex-1 border rounded-l-md px-3 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={() => {
                handleSearch();
                setMenuOpen(false); // close menu after search
              }}
              className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 rounded-r-md hover:opacity-90 transition"
            >
              Search
            </button>
          </div>

          <div className="flex flex-col gap-4 text-gray-700">
            <button
              className="flex items-center gap-2"
              onClick={() => {
                navigate("/cart");
                setMenuOpen(false);
              }}
            >
              <ShoppingCart size={20} /> Cart
              {cartCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="flex items-center gap-2"
              onClick={() => {
                navigate("/wishlist");
                setMenuOpen(false);
              }}
            >
              <Heart size={20} /> Wishlist
            </button>

            <button
              className="flex items-center gap-2"
              onClick={() => {
                navigate("/notifications");
                setMenuOpen(false);
              }}
            >
              <Bell size={20} /> Notifications
            </button>

            {user ? (
              <div className="mb-2 border-t pt-2">
                <p className="text-gray-700 font-semibold px-2">
                  Hello, {displayName}
                </p>
                <button
                  className="block w-full text-left px-2 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-2 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/orders");
                    setMenuOpen(false);
                  }}
                >
                  Orders
                </button>
                <button
                  className="block w-full text-left px-2 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/settings");
                    setMenuOpen(false);
                  }}
                >
                  Settings
                </button>

                   <button
                  className="block w-full text-left px-2 py-2 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/contact");
                    setMenuOpen(false);
                  }}
                >
                  Contact Us
                </button>

                <button
                  className="block w-full text-left px-2 py-2 hover:bg-gray-100 text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="flex items-center gap-2"
                onClick={() => {
                  onLoginClick();
                  setMenuOpen(false);
                }}
              >
                <User size={20} /> Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
