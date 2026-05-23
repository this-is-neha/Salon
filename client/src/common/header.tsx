import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token && token !== "");
  }, []);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    setIsLoggedIn(false);

   
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              EkbanaSalon
            </span>
          </div>

          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#services" className="hover:text-indigo-600 transition-colors">
              Services
            </a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">
              Why Us
            </a>
            <a href="#reviews" className="hover:text-indigo-600 transition-colors">
              Reviews
            </a>

            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm border border-red-200"
                >
                  Logout
                </button>
              ) : (
                <>
                  <a href="/" className="text-slate-700 hover:text-indigo-600 transition-colors">
                    Sign In
                  </a>
                  <a
                    href="/"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    Join Now
                  </a>
                </>
              )}
            </div>
          </div>

        
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 font-medium shadow-inner">
          <a href="#services" className="block py-2 text-slate-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
            Services
          </a>
          <a href="#features" className="block py-2 text-slate-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
            Why Us
          </a>
          <a href="#reviews" className="block py-2 text-slate-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>
            Reviews
          </a>
          <hr className="border-slate-100 my-2" />

          {isLoggedIn ? (
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-lg mt-2 font-semibold shadow-sm hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <a href="/" className="block py-2 text-slate-700 hover:text-indigo-600">
                Sign In
              </a>
              <a href="/" className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-lg mt-2 font-semibold">
                Join Now
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}