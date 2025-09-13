"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Contact() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={`mt-10 min-h-screen px-6 py-12 md:px-16 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Page Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className=" text-2xl sm:text-4xl  font-bold text-center my-8"
      >
         Contact <span className="text-cyan-500">MediConnect</span>
      </motion.h1>

      {/* Contact Form */}
      <motion.section
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`max-w-2xl mx-auto border ${isDarkMode ? "bg-gray-800 border-cyan-500" : "bg-gray-100 border-gray-900"} p-6 rounded-lg shadow-lg`}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className={`p-3 border rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            value={formData.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className={`p-3 border rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className={`p-3 border rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            value={formData.subject}
            onChange={handleInputChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            className={`p-3 border rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            value={formData.message}
            onChange={handleInputChange}
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            className="bg-cyan-500 text-white p-3 rounded-lg font-semibold"
          >
            Send Message
          </motion.button>
        </form>
        {submitted && <p className="text-green-500 text-center mt-4">✅ Message Sent Successfully!</p>}
      </motion.section>

      {/* Location Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-14"
      >
        <h2 className="text-2xl font-semibold text-center">📍 Our Location</h2>
        <p className="text-center text-lg mt-2">Find the nearest MediConnect center:</p>
        <iframe
          className="w-full h-64 mt-4 rounded-lg shadow-lg"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.846509078697!2d85.13675631536284!3d25.594094783701456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58f4f0fd0b8b%3A0x1e5bf3d64c6f8b6f!2sIIT%20Patna!5e0!3m2!1sen!2sin!4v1639384734458!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </motion.section>

      {/* Support Options */}
      <motion.section className="mt-14">
        <h2 className="text-2xl font-semibold text-center"> Support Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 text-center">
          {[
            { title: "User Support", email: "support@mediconnect.com" },
            { title: "Doctor Support", email: "doctors@mediconnect.com" },
            { title: "Health Centers", email: "centers@mediconnect.com" },
            { title: "Developer Support", email: "dev@mediconnect.com" },
          ].map((support, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className={`p-4 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <Mail className="w-6 h-6 mx-auto mb-2" />
              <p>{support.title}</p>
              <a href={`mailto:${support.email}`} className="text-cyan-500">{support.email}</a>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Social Media */}
      <motion.section className="mt-14 text-center">
        <h2 className="text-2xl font-semibold">🌐 Follow Us</h2>
        <div className="flex justify-center gap-6 mt-4">
          {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
            <motion.a key={index} whileHover={{ scale: 1.2 }} href="#" className="text-cyan-500">
              <Icon className="w-8 h-8" />
            </motion.a>
          ))}
        </div>
      </motion.section>


    </div>
  );
}
