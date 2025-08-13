import React from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import './Contact.css'; // Assuming you have a CSS file for styling 

const Contact = () => {
  return (
    <div
    >
         {/* Contact Section */}
      <section className="contact-section" id='contact'>
        <div className="container">
          <h2 className="section-title" >Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3 className="contact-info-title">Contact Information</h3>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-details">
                  <h4>Email Address</h4>
                  <p>support@yourstore.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-details">
                  <h4>Phone Number</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <MapPin size={24} />
                </div>
                <div className="contact-details">
                  <h4>Office Address</h4>
                  <p>123 Tech Street, Digital City, DC 12345</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Clock size={24} />
                </div>
                <div className="contact-details">
                  <h4>Business Hours</h4>
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3 className="contact-form-title">Send Us a Message</h3>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Enter your full name" />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="Enter your email" />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" className="form-input" placeholder="Enter message subject" />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" placeholder="Enter your message..."></textarea>
              </div>

              <button className="form-button">Send Message</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact