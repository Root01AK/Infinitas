// app/contact/FaqSection.jsx
"use client";

import { useState, useEffect } from "react";

export default function FaqSection({ faqTitle, categories, faqData }) {
  const [activeCategory, setActiveCategory] = useState(
    categories.length > 0 ? categories[0].Title : ""
  );
  const [openIndex, setOpenIndex] = useState(null);

  // Debug logging
  useEffect(() => {
  }, [activeCategory, categories, faqData]);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const currentFaqs = faqData[activeCategory] || [];

  return (
    <div className="contact-faq">
      <div className="contact-faq-heading heading">
        <h1>{faqTitle}</h1>
      </div>

      <div className="contact-faq-items">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`contact-faq-item ${
              activeCategory === category.Title ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(category.Title);
              setOpenIndex(null);
            }}
          >
            {category.Title}
          </div>
        ))}
      </div>

      <div className="contact-faq-content">
        {currentFaqs.length === 0 ? (
          <div style={{ 
            padding: '40px 20px', 
            textAlign: 'center', 
            color: '#999',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            margin: '20px 0'
          }}>
            <p>No FAQs found for "{activeCategory}"</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              We are working on it. Please check back later.
            </p>
          </div>
        ) : (
          currentFaqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="faq-block">
                <div
                  className="faq-question"
                  onClick={() => toggleAnswer(index)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon">{isOpen ? "➖" : "➕"}</span>
                </div>
                <div className={`faq-answer-wrapper ${isOpen ? "open" : ""}`}>
                  <p className="faq-answer">{item.a}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}