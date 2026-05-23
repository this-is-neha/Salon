// home.tsx
import { useState, useEffect } from "react";
import Navbar from "../common/header";
import { useNavigate } from "react-router-dom";
export default function Homepage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token && token !== "");
  }, []);

  const handleLogout = () => {
    localStorage.setItem("token", "");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decodedPayload = JSON.parse(atob(token.split(".")[1]));
        setUserId(decodedPayload?.sub);
        if (decodedPayload?.role?.toLowerCase() === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);
  const navigate = useNavigate();
  const services = [
    {
      id: 1,
      name: "Haircut & Styling",
      price: "$45+",
      duration: "45 mins",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      name: "Beard Grooming",
      price: "$25+",
      duration: "30 mins",
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      name: "Luxury Facial Treatment",
      price: "$60+",
      duration: "60 mins",
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      name: "Hair Coloring Therapy",
      price: "$90+",
      duration: "120 mins",
      image:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Customer",
      text: "The booking process was incredibly smooth. I received my confirmation email immediately, and the service was top-notch!",
      rating: 5,
    },
    {
      id: 2,
      name: "David Miller",
      role: "Customer",
      text: "Finally, a salon where I don't have to wait in queues. Real-time availability slots saved me so much hassle.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Navbar />

      <header className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-xs font-semibold text-indigo-700">
              ✨ Real-Time Appointment Slots Now Active
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
              Premium Styling, <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Scheduled in Seconds.
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
              Skip the long queues. Secure your personal appointment slot with
              top salon professionals and get instant email confirmation tokens
              safely sent directly to you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
             {isAdmin && (
  <button
    onClick={() => navigate("/bulk")}
    className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all"
  >
    Bulk Upload
  </button>
)}
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/login");
                  } else if (isAdmin) {
                    navigate("/appointment/admin/all");
                  } else {
                    navigate(`/appointment/${userId}/all`);
                  }
                }}
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-center"
              >
                {!isLoggedIn
                  ? "Book Your Slot"
                  : isAdmin
                    ? "Manage Global Appointments"
                    : "View Your Appointments"}
              </button>

              <button
                onClick={() => navigate("/services")}
                className="border border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all text-center"
              >
                Explore Services
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl" />
            <img
              className="relative rounded-2xl shadow-xl w-full object-cover h-[450px]"
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80"
              alt="Luxury Salon Interior Studio"
            />
          </div>
        </div>
      </header>

      <section
        id="services"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Our Professional Treatments
          </h2>
          <p className="text-slate-600">
            Select an option below to easily see session duration configurations
            and lock down available staff.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <img
                src={service.image}
                alt={service.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">
                    {service.name}
                  </h3>
                  <div className="text-sm text-slate-500 flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {service.duration}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-black text-indigo-600">
                    {service.price}
                  </span>
                  <a
                    href={isLoggedIn ? "/appointments" : "/"}
                    className="bg-slate-100 hover:bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    {isLoggedIn ? "Reserve Slot" : "Login to Book"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    
      <section
        id="features"
        className="bg-white border-y border-slate-200 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
              Engineered For Efficiency
            </h2>
            <p className="text-slate-600">
              We built our system parameters specifically to value your
              scheduling timeline constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Verified Activations
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Secure relational database token systems guarantee that every
                registering profile is authenticated before booking any active
                floor slot.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Zero Mass Conflicts
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Atomic database row mutations completely guarantee that two
                profiles can never claim the same specialist during identical
                session blocks.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Automated Reminders
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Integrated secure transactional nodes automatically send dynamic
                operational status emails, matching your session records
                instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

    
      <section
        id="reviews"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-slate-600">
            Real feedback from users who manage appointments through our unified
            portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <p className="italic text-slate-600 text-sm leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {t.role}
                  </span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {"★".repeat(t.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-sm">
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">
              EkbanaSalon
            </span>
            <p className="text-xs text-slate-500 mt-1">
              © {new Date().getFullYear()} Salon Panel System. All Rights
              Reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#services" className="hover:text-white transition-colors">
              Treatments
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="hover:text-red-400 transition-colors text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}



