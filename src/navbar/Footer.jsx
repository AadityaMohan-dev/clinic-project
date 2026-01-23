import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold mb-4">O Dental Clinic</h3>
            <p className="text-sm leading-relaxed">
              Expert dental care with Dr. Shirley Ma, specializing in implantology 
              and cosmetic dentistry. Your smile is our priority.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a to="/" className="hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a to="/about" className="hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a to="/services" className="hover:text-white transition-colors text-sm">
                  Services
                </a>
              </li>
              <li>
                <a to="/appointments" className="hover:text-white transition-colors text-sm">
                  Book Appointment
                </a>
              </li>
              <li>
                <a to="/contact" className="hover:text-white transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">
                Dental Implants
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Cosmetic Dentistry
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Root Canal Treatment
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Teeth Whitening
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Orthodontics
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>
                  KD 108, Block D, Sector 18,<br />
                  Kavi Nagar, Ghaziabad,<br />
                  Uttar Pradesh 201002
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a href="mailto:drshirleyma@yahoo.co.in" className="hover:text-white transition-colors">
                  drshirleyma@yahoo.co.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {currentYear} O Dental Clinic. All rights reserved.</p>
            <div className="flex gap-6">
              <a to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;