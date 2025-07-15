import React from "react";
import "./contact.css"; // We'll create this CSS 

const Contact = () => {
  return (
    <div className="contact-container">
      <h2 className="contact-title">LET'S CONNECT</h2>

      {/* Contact Details Section */}
      <div className="contact-details">
        <div className="contact-info-box">
          <i className="fas fa-map-marker-alt contact-icon"></i>
          <h3 className="info-title">OUR MAIN OFFICE</h3>
          <p>G1, Akansha Apartment, Patel Nagar, City Centre, Gwalior, Near Raj Rajeshwari Apartment-474002</p>
        </div>
        <div className="contact-info-box">
          <i className="fas fa-phone contact-icon"></i>
          <h3 className="info-title">PHONE NUMBER</h3>
          <p>+91-9319250172</p>
          <p>+91-6261068377</p>
        </div>
        <div className="contact-info-box">
          <i className="fas fa-envelope contact-icon"></i>
          <h3 className="info-title">EMAIL</h3>
          <p><a href="mailto:info@lordtechdatus.com" className="email-link">info@lordtechdatus.com</a></p>
        </div>
      </div>

      {/* Contact Form & Map Section */}
      <div className="contact-form-map">
        {/* Contact Form */}
        <div className="contact-form">
          <h3 className="form-title">GET A FREE CASE EVALUATION TODAY!</h3>
          <p className="form-subtitle">AVAILABLE 24 HOURS A DAY!</p>
          <form>
            <input type="text" placeholder="Enter your Name" className="form-input" />
            <input type="email" placeholder="Enter a valid email address" className="form-input" />
            <textarea placeholder="Enter your message" className="form-textarea"></textarea>
            <button type="submit" className="form-button">Submit</button>
          </form>
        </div>

        {/* Location Map */}
        <div className="map-container">
          <h3 className="map-title">WE ARE HERE</h3>
          <p className="map-subtitle">MON-FRI 8:30AM-5PM / PHONES ARE OPEN 24/7</p>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202.4591966697801!2d78.18986054509881!3d26.209845939493405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c41cce3cd799%3A0x184f3cb9095a386c!2zQWthbnNoYSBBcGFydG1lbnQgKOCkhuCkleCkvuCkguCktuCkviDgpIXgpKrgpL7gpLDgpY3gpJ_gpK7gpYfgpILgpJ8p!5e1!3m2!1sen!2sin!4v1741986815510!5m2!1sen!2sin"
            className="map-iframe"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <footer className="contact-footer">
        <p>Copyright © Lordtech Datus Salutions, All Rights Reserved.<a href="/" className="footer-link">Global Journal of construction management and engineering </a>.</p>
      </footer>
    </div>
  );
};

export default Contact;
