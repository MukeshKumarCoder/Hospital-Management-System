import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClerk, SignedOut, SignedIn, UserButton } from "@clerk/clerk-react";
import { User, Key, Menu, X } from "lucide-react";
import { navbarStyles } from "../assets/dummyStyles";
import logo from "../assets/logo.png";

const STORAGE_KEY = "doctorToken_v1";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });
  const location = useLocation();
  const navRef = useRef(null);
  const clerk = useClerk();
  const navigate = useNavigate();

  // Hide and Show Navbar on Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Sync the doctor login State
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setIsDoctorLoggedIn(Boolean(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // close the toggle menu for mobile when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <div className={navbarStyles.navbarBorder}></div>

      <nav
        ref={navRef}
        className={`${navbarStyles.navbarContainer} ${
          showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden
        }`}
      >
        <div className={navbarStyles.contentWrapper}>
          <div className={navbarStyles.flexContainer}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className={navbarStyles.logoImageWrapper}>
                <img
                  src={logo}
                  alt="logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h1
                  className={`${navbarStyles.logoTitle} text-xl leading-none font-bold`}
                >
                  MediCare
                </h1>
                <p
                  className={`${navbarStyles.logoSubtitle} whitespace-nowrap leading-none text-xs mt-1`}
                >
                  Healthcare Solutions
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className={navbarStyles.desktopNav}>
              <div className={navbarStyles.navItemsContainer}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`${navbarStyles.navItem} ${
                        isActive
                          ? navbarStyles.navItemActive
                          : navbarStyles.navItemInactive
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side (Desktop) */}
            <div className={navbarStyles.rightContainer}>
              <SignedOut>
                <Link
                  to="/doctor-admin/login"
                  className={navbarStyles.doctorAdminButton}
                >
                  <User className={navbarStyles.doctorAdminIcon} />
                  <span className={navbarStyles.doctorAdminText}>
                    Doctor Admin
                  </span>
                </Link>
                <button
                  onClick={() => clerk.openSignIn()}
                  className={navbarStyles.loginButton}
                >
                  <Key className={navbarStyles.loginIcon} />
                  Login
                </button>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* Mobile toggle button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={navbarStyles.mobileToggle}
              >
                {isOpen ? (
                  <X className={navbarStyles.toggleIcon} />
                ) : (
                  <Menu className={navbarStyles.toggleIcon} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className={navbarStyles.mobileMenu}>
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`${navbarStyles.mobileMenuItem} ${
                      isActive
                        ? navbarStyles.mobileMenuItemActive
                        : navbarStyles.mobileMenuItemInactive
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* الجزء اللي كان ناقص وضفناه هنا */}
              <SignedOut>
                <Link
                  to="/doctor-admin/login"
                  className={navbarStyles.mobileDoctorAdminButton}
                  onClick={() => setIsOpen(false)}
                >
                  Doctor Admin
                </Link>

                <div className={navbarStyles.mobileLoginContainer}>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      clerk.openSignIn();
                    }}
                    className={navbarStyles.mobileLoginButton}
                  >
                    Login
                  </button>
                </div>
              </SignedOut>
            </div>
          )}
        </div>
        <style>{navbarStyles.animationStyles}</style>
      </nav>
    </>
  );
};

export default Navbar;
