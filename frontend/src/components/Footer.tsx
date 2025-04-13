
import React from 'react';
import { Instagram, Youtube, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NSS Logo and Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-bold mb-2">NSS IIT Patna</h2>
            <p className="text-sm text-gray-300 text-center md:text-left">Not Me But You</p>
          </div>
          
          {/* Social Media */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/nss_iitpatna/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-colors hover:text-pink-400"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.youtube.com/@nssiitpatna" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-colors hover:text-red-500"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex flex-col space-y-2">
              <a 
                href="mailto:nss@iitp.ac.in" 
                className="flex items-center gap-2 hover:text-blue-300 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>nss@iitp.ac.in</span>
              </a>
              <a 
                href="tel:+919876543210" 
                className="flex items-center gap-2 hover:text-blue-300 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+91 9876543210</span>
              </a>
              <p className="text-sm text-gray-300 flex items-start mt-2">
                IIT Patna, Bihta, Patna, Bihar
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} National Service Scheme, IIT Patna. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
