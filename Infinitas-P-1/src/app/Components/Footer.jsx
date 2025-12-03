'use client'
import React from "react";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { FiPhone } from "react-icons/fi";
import { GoArrowUpRight } from "react-icons/go";
import { TbMailFilled } from "react-icons/tb";
import { FaFacebook, FaLinkedin, FaInstagram, FaLocationDot } from "react-icons/fa6";

export default function Footer() {
  const pathname = usePathname();
  return (
    <div className="footer-container">
      <div className="footer-grid-section">
        <div className="footer-heading">
          <h2>infinitas</h2>
        </div>
        <div className="footer-grid-item-1">
          <div className="footer-item">
            <Link href="/" className={pathname === "/" ? "active-link" : ""}>Home</Link>
            <Link href="/About" className={pathname === "/About" ? "active-link" : ""}>About</Link>
            <Link href="/Service" className={pathname === "/Service" ? "active-link" : ""}>Service</Link>
            <Link href="/Industries" className={pathname === "/Industries" ? "active-link" : ""}>Industries</Link>
            <Link href="/Team" className={pathname === "/Team" ? "active-link" : ""}>Team</Link>
            <Link href="/Career" className={pathname === "/Career" ? "active-link" : ""}>Careers</Link>
            <Link href="/Contact" className={pathname === "/Contact" ? "active-link" : ""}>Contact</Link>
          </div>
        </div>
        <div className="footer-grid-item-2">
          <Link href="mailto:info@infinitasadvisory.com"><TbMailFilled size='23' /> info@infinitasadvisory.com</Link>
        </div>

        <div className="footer-grid-item-3">
          <Link href="#"><FaLocationDot size='23' />Dubai, UAE</Link>
          <Link href="tel:+919841059274"><FiPhone size='23' /> +91 9841059274</Link>
        </div>
        <div className="footer-grid-item-4">
          <div className="footer-item">
            <Link href="/Terms">Terms of Service<GoArrowUpRight /></Link>
            <Link href="/Privacy">Privacy Policy<GoArrowUpRight /></Link>
          </div>
        </div>
        <div className="footer-grid-item-5">
          <h1>Follow us on</h1>
          <div className="footer-item">
            <a
              href="https://www.facebook.com/profile.php?id=61583391791129"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={20} /> Facebook
            </a>

            <a
              href="https://www.linkedin.com/company/infinitasadvisory/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={20} /> LinkedIn
            </a>

            <a
              href="https://www.instagram.com/infinitas_advisory/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={20} /> Instagram
            </a>
          </div>

        </div>
        <div style={{ gridRow: '1 / span 4', gridColumnStart: '4', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', textAlign: 'center', padding: '16px 0 0 0', fontSize: '18px', color: 'grey' }}>
          <div className="footer-cta-desk" style={{ textAlign: 'start', fontWeight: '800', fontSize: '2.3rem', color: 'grey' }}>
            Advise. <br /> Execute. <br /> Impact.
          </div>
          <div className="footer-cta" style={{ textAlign: 'start', fontWeight: '800', fontSize: '1.5rem', color: 'grey' }}>
            Advise. Execute. Impact.
          </div>
          <div style={{ textAlign: 'end', fontSize: '10px' }}>
            <span>
              © 2025 Infinitas Advisory. All rights reserved.
            </span>
          </div>
        </div>
      </div>
      <div className="designed-by">
        Designed and Developed by <a href="https://vcraftyucompany.com/" target="_blank">Vcraftyu Company</a>
      </div>
    </div>
  );
}
