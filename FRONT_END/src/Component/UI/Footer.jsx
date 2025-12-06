import React from 'react'
import { GiPositionMarker } from "react-icons/gi";
import { FaPhoneAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { Link } from 'react-router-dom';

const Footer = () => {

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FaFacebook, href: "#", label: "Facebook" },
        { icon: FaInstagram, href: "#", label: "Instagram" },
        { icon: FaTwitter, href: "#", label: "Twitter" },
        { icon: FaLinkedin, href: "#", label: "LinkedIn" },
      ];
    const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Session", path: "/Session" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];
   return (
    <footer className="bg-blue-600 text-white border-t border-blue-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold italic">
                FITNESS <span className="text-blue-800">FLOW</span>
              </span>
            </div>
            <p className="leading-relaxed mb-6">
              We are a modern and dynamic gym dedicated to your success. 
              State-of-the-art equipment, certified coaches, and a motivating community - 
              everything is here to help you achieve your goals.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Newsletter</h4>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 border text-black border-blue-600 rounded-lg placeholder-gray-500 focus:outline-none focus:border-blue-600"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  <FaArrowRight className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-2/3 h-0.5 bg-white"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="flex items-center space-x-2 text-white transition-colors group"
                  >
                    <FaArrowRight className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Contact
              <span className="absolute bottom-0 left-0 w-2/3 h-0.5 bg-white"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <GiPositionMarker className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="font-medium text-white">Address</p>
                  <p className="">Hay Salam, Agadir, Morocco</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <p className="">+212 54332178</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <IoIosMail className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="">fitness.flow@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-6 text-white relative inline-block">
              Opening Hours
              <span className="absolute bottom-0 left-0 w-2/3 h-0.5 bg-white"></span>
            </h3>
            <div className="space-y-2 ">
              <div className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="font-medium text-white">6:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium text-white">7:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-medium text-white">8:00 - 20:00</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <social.icon className="text-2xl text-blue-600 group-hover:scale-105 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white text-sm">
              © {currentYear} FORCE MAX. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-white  transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white  transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-white  transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer