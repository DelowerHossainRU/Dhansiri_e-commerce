import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Heart, User, Search, Menu, X, ChevronDown, 
  Sprout, LogOut, LayoutDashboard, ShieldCheck, Truck, Scale
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import client from '../../api/client';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const userDropdownRef = useRef(null);

  const { totalItemsCount, subtotal, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout, isAdmin, isWholesaleCustomer } = useAuth();
  const { t, language, formatPrice } = useLanguage();
  const navigate = useNavigate();
  const isBn = language === 'bn';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await client.get(`/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        const list = res?.data || (Array.isArray(res) ? res : []);
        const results = Array.isArray(list) ? list : (list.data || []);
        setSearchResults(results);
        if (results.length > 0) setShowSearchDropdown(true);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { labelEn: 'Shop', labelBn: 'শপ ক্যাটালগ', path: '/shop' },
    { labelEn: 'Seasonal Harvest', labelBn: 'মৌসুমি ফলন', path: '/seasonal' },
    { labelEn: 'Fresh Arrivals', labelBn: 'তাজা ফসল', path: '/fresh-harvest' },
    { labelEn: 'Wholesale B2B', labelBn: 'পাইকারি বাণিজ্য', path: '/wholesale' },
    { labelEn: 'Partner Farmers', labelBn: 'কৃষক নেটওয়ার্ক', path: '/farmers' },
    { labelEn: 'Quality & Traceability', labelBn: 'গুণমান পরীক্ষা', path: '/quality' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all duration-200 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4 lg:gap-8">
          
          {/* Brand Logo & Mobile Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 select-none group">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-2xs group-hover:bg-emerald-900 transition-colors">
                <Sprout className="w-4.5 h-4.5 text-emerald-300" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-900 transition-colors">
                  Dhansiri
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
                  Agro
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-[13px] font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-emerald-900 font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-800 after:rounded-full'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`
                }
              >
                {isBn ? link.labelBn : link.labelEn}
              </NavLink>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Desktop Minimal Search */}
            <div ref={searchContainerRef} className="hidden md:block relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                  placeholder={isBn ? 'পণ্য খুঁজুন...' : 'Search harvest...'}
                  className="w-36 lg:w-48 focus:w-60 transition-all text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:bg-white focus:border-emerald-700 outline-none text-slate-800"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-800"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Minimal Search Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.map((item) => (
                      <Link
                        key={item._id}
                        to={`/products/${item.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-2.5 p-2.5 hover:bg-slate-50 transition-colors"
                      >
                        <img
                          src={item.featuredImage}
                          alt={item.name}
                          className="w-9 h-9 rounded-md object-cover border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold text-slate-800 block truncate">
                            {isBn && item.banglaName ? item.banglaName : item.name}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-medium">
                            {item.district || item.origin}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/account/wishlist"
              className="p-2 text-slate-600 hover:text-emerald-800 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-slate-700 hover:text-emerald-900 transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Account Menu / Sign In */}
            <div ref={userDropdownRef} className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 hover:text-emerald-900 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  {isBn ? 'লগইন' : 'Sign In'}
                </Link>
              )}

              {/* Authenticated Dropdown */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 block truncate">{user?.name}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{user?.email}</span>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-800"
                  >
                    {isBn ? 'আমার অ্যাকাউন্ট' : 'My Account'}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-amber-800 font-bold hover:bg-amber-50"
                    >
                      {isBn ? 'অ্যাডমিন কনসোল' : 'Admin Operations'}
                    </Link>
                  )}
                  {isWholesaleCustomer && (
                    <Link
                      to="/wholesale/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 text-emerald-800 font-bold hover:bg-emerald-50"
                    >
                      {isBn ? 'হোলসেল ড্যাশবোর্ড' : 'B2B Trade Portal'}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 border-t border-slate-100"
                  >
                    {isBn ? 'লগআউট' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'পণ্য খুঁজুন...' : 'Search harvest...'}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 outline-none"
            />
            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="space-y-1 text-xs">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg font-medium ${
                    isActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {isBn ? link.labelBn : link.labelEn}
              </NavLink>
            ))}
            <Link
              to="/quotations/request"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-semibold text-emerald-800 bg-emerald-50/50"
            >
              {isBn ? 'পাইকারি কোটেশন (RFQ)' : 'Wholesale Bulk RFQ'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
