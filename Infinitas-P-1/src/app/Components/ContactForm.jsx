"use client";

import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+971",
    phone: "",
    message: "",
  });

  const countryCodes = [
    { code: "+971", label: "United Arab Emirates" },
    { code: "+91", label: "India" },
    { code: "+1", label: "United States" },
    { code: "+44", label: "United Kingdom" },
    { code: "+966", label: "Saudi Arabia" },
    { code: "+974", label: "Qatar" },
    // Add more as needed
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSubmitError("");
  };

  const totalSteps = 4;

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.firstName.trim() &&
          formData.lastName.trim() &&
          formData.email.trim() &&
          formData.phone.trim()
        );
      case 2:
        return selectedService !== "";
      case 3:
        return formData.message.trim() !== "";
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      alert("Please fill in all required fields");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectService = (serviceName) => {
    setSelectedService(serviceName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const submissionData = {
        data: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: `${formData.countryCode} ${formData.phone.trim()}`,
          service: selectedService,
          message: formData.message.trim(),
        },
      };

      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';
      
      const response = await fetch(`${apiUrl}/enquiry-forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to submit form");
      }

      const result = await response.json();
      // console.log("Form submitted successfully:", result);

      // Move to success step
      setCurrentStep(5);
    } catch (error) {
      // console.error("Error submitting form:", error);
      setSubmitError(
        error.message || "Failed to submit form. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+971",
      phone: "",
      message: "",
    });
    setSelectedService("");
    setCurrentStep(1);
    setSubmitError("");
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="contact-form-container">
      {/* Contact Info */}
      <div className="contact-left">
        <h2 className="flex items-center gap-2">
          <span style={{ fontSize: "30px" }}>☏ </span>
          Talk to Us
        </h2>

        <div className="contact-info-item">
          <div className="icon">
            <Phone size={20} color="#040d1e" strokeWidth={2} />
          </div>
          <a href="tel:+919841059274">+91 9841059274</a>
        </div>
        <div className="contact-info-item">
          <div className="icon">
            <Mail size={20} color="#040d1e" strokeWidth={2} />
          </div>
          <a href="mailto:info@infinitasadvisory.com">
            info@infinitasadvisory.com
          </a>
        </div>
        <div className="contact-info-item">
          <div className="icon">
            <MapPin size={20} color="#040d1e" strokeWidth={2} />
          </div>
          <p>Dubai, UAE</p>
        </div>
        <div className="contact-social-media">
          <h3>Follow Us on:</h3>
          <div className="social-icons-row">
            <a
              href="https://www.instagram.com/infinitas_advisory/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61583391791129"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/infinitasadvisory/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="decorative-emojis emoji-1">👋</div>
        <div className="decorative-emojis emoji-2">✨</div>
        <div className="decorative-emojis emoji-3">🎉</div>
        <div className="decorative-emojis emoji-4">📱</div>

        <div className="form-header">
          <h1>We want to get to know you 😊</h1>
          <div className="step-indicator">
            <span>{String(currentStep).padStart(2, "0")}</span>/04
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {submitError && (
          <div
            style={{
              background: "#fee",
              color: "#c00",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
              border: "1px solid #fcc",
            }}
          >
            ⚠️ {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="form-step">
              <div className="step-title">
                <span>👋</span> Hi! What&apos;s your name?
              </div>
              <div className="row">
                <div className="user-box">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <label>First Name</label>
                </div>
                <div className="user-box">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  <label>Last Name</label>
                </div>
              </div>
              <div className="row">
                <div className="user-box">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <label>Email</label>
                </div>
                <div
                  className="user-box"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      maxWidth: "100px",
                      cursor: "pointer",
                      background: "none",
                      outline: "none",
                      border: "none",
                    }}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                  <label style={{ paddingLeft: "90px" }}>Contact Number</label>
                </div>
              </div>
              <div className="btn-group">
                <button type="button" className="btn btn-outline" disabled>
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {currentStep === 2 && (
            <div className="form-step">
              <div className="step-title">
                <span>📦</span> What service do you need?
              </div>
              <div className="service-options">
                {[
                  { icon: "📊", name: "Project Management" },
                  { icon: "📈", name: "Marketing Management" },
                  { icon: "🛒", name: "Sourcing & Procurement" },
                  { icon: "💻", name: "Tech & Development" },
                  { icon: "📱", name: "Digital Marketing" },
                  { icon: "🤔", name: "Other" },
                ].map((service) => (
                  <div
                    key={service.name}
                    className={`service-option ${
                      selectedService === service.name ? "selected" : ""
                    }`}
                    onClick={() => selectService(service.name)}
                  >
                    <div className="service-icon">{service.icon}</div>
                    <div className="service-name">{service.name}</div>
                  </div>
                ))}
              </div>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={prevStep}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!selectedService}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Message */}
          {currentStep === 3 && (
            <div className="form-step">
              <div className="step-title">
                <span>✍️</span> Tell us more about your requirements
              </div>
              <div className="user-box">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                ></textarea>
                <label>Define Your Service Requirements</label>
              </div>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={prevStep}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="form-step">
              <div className="step-title">
                <span>⚡</span> Need immediate assistance?
              </div>
              <p className="urgency-text">
                Ready to submit! If you need urgent help, reach out directly:
              </p>
              <div className="urgency-options">
                <a href="tel:+919841059274" className="urgency-btn">
                  <span className="urgency-icon">📞</span>
                  Call Us Now
                </a>
                <a
                  href="https://wa.me/919841059274"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="urgency-btn"
                >
                  <span className="urgency-icon">💬</span>
                  WhatsApp Chat
                </a>
              </div>
              <div className="btn-group" style={{ marginTop: "30px" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Thank You */}
          {currentStep === 5 && (
            <div className="form-step">
              <div className="thank-you">
                <div className="thank-you-emoji">🎉</div>
                <h2>Thank you for submitting!</h2>
                <p>
                  We&apos;re excited to chat. We will reach out to you soon via email
                  or phone.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={resetForm}
                >
                  Submit Another
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}