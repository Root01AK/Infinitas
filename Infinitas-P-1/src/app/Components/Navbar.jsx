"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAllServices } from "../../../lib/strapi";

const toSlug = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function Navbar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [serviceDropdowns, setServiceDropdowns] = useState([]);

  // Load service dropdowns from Strapi so navbar stays in sync
  useEffect(() => {
    const loadServices = async () => {
      try {
        const groups = await fetchAllServices();
        const dropdowns = groups.map((group) => {
          const parentSlug = toSlug(group.parentService || "");

          return {
            id: group.parentId,
            title: group.parentService,
            // Main link goes to /Service/parent-service
            titleHref: `/Service/${parentSlug}`,
            // Child links go to /Service/parent-service/service-title-slug
            items: (group.ServiceList || []).slice(0, 3).map((item) => {
              const itemSlug = toSlug(item.title || "");
              return {
                name: item.title,
                href: `/Service/${parentSlug}/${itemSlug}`,
              };
            }),
          };
        });

        setServiceDropdowns(dropdowns);
      } catch (err) {
        // console.error("Failed to load services for navbar", err);
        setServiceDropdowns([]);
      }
    };

    loadServices();
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (currentScrollPos < 50) {
        setVisible(true);
      } else {
        setVisible(prevScrollPos > currentScrollPos);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Toggle mobile dropdown
  const toggleMobileDropdown = () => {
    setActiveDropdown(activeDropdown === "service" ? null : "service");
  };

  return (
    <div className="navbar-container">
      <div
        className={`navbar-section ${
          visible ? "navbar-visible" : "navbar-hidden"
        }`}
      >
        <div className="navbar-logo">
          <img src="/Infinitas.png" alt="Logo" />
        </div>

        {/* Case Study - Desktop Only */}
        <div className="navbar-item">
          <Link href="/CaseStudy">Expertise</Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="hamburger-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Desktop & Mobile Navigation */}
        <div className={`navbar-list ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/About" onClick={() => setMobileMenuOpen(false)}>
            Why us
          </Link>

          {/* Service Dropdown */}
          <div
            className="dropdown-wrapper"
            onMouseEnter={() => setActiveDropdown("service")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span 
              className="dropdown-trigger"
              onClick={toggleMobileDropdown}
            >
              Service <img src="/down.svg" className="down-arrow" />
            </span>

            <div
              className={`dropdown-menu ${
                activeDropdown === "service" ? "active" : ""
              }`}
            >
              {serviceDropdowns.map((dropdown) => (
                <div key={`${dropdown.id}-${dropdown.titleHref}`} className="dropdown-column">
                  <Link
                    href={dropdown.titleHref}
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <h4 className="dropdown-heading">{dropdown.title}</h4>
                  </Link>
                  {dropdown.items.map((item, index) => (
                    <Link
                      key={`${item.href}-${index}`}
                      href={item.href}
                      className="dropdown-item"
                      onClick={() => {
                        setActiveDropdown(null);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href={dropdown.titleHref}
                    className="dropdown-see-more"
                    onClick={() => {
                      setActiveDropdown(null);
                      setMobileMenuOpen(false);
                    }}
                  >
                    + See More
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <Link href="/Industries" onClick={() => setMobileMenuOpen(false)}>
            Industries
          </Link>
          <Link href="/Team" onClick={() => setMobileMenuOpen(false)}>
            Team
          </Link>
          <Link href="/Career" onClick={() => setMobileMenuOpen(false)}>
            Careers
          </Link>

          {/* Case Study & Contact - Mobile Only */}
          <Link href="/CaseStudy" onClick={() => setMobileMenuOpen(false)} className="mobile-only">
            Expertise
          </Link>
          <Link href="/Contact" onClick={() => setMobileMenuOpen(false)} className="mobile-only">
            Contact
          </Link>
        </div>

        {/* Contact - Desktop Only */}
        <div className="navbar-contact">
          <Link href="/Contact">contact</Link>
        </div>
      </div>
    </div>
  );
}