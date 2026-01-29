import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter, ArrowUpRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Dental Implants", href: "/services/implants" },
    { name: "Cosmetic Dentistry", href: "/services/cosmetic" },
    { name: "Root Canal Treatment", href: "/services/root-canal" },
    { name: "Teeth Whitening", href: "/services/whitening" },
    { name: "Orthodontics", href: "/services/orthodontics" }
  ];

    const quickLinks = [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Appointments", href: "/login" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" }
    ];

  const socialLinks = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      href: "https://facebook.com",
      color: "hover:bg-blue-600" 
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      href: "https://instagram.com",
      color: "hover:bg-pink-600" 
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      href: "https://twitter.com",
      color: "hover:bg-sky-500" 
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      href: "https://linkedin.com",
      color: "hover:bg-blue-700" 
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* About Section - Enhanced */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">O</span>
                  </div>
                </div>
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  O Dental Clinic
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Expert dental care with Dr. Shirley Ma, specializing in implantology 
                and cosmetic dentistry. Your smile is our priority.
              </p>
            </div>

            {/* Social Links - Enhanced */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-2.5 bg-gray-800 rounded-lg transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services - Enhanced */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Our Services
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-sm text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Enhanced */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="group">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300">
                  <div className="p-2 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  </div>
                  <div className="text-sm text-gray-400 leading-relaxed">
                    <p>KD 108, Block D, Sector 18,</p>
                    <p>Kavi Nagar, Ghaziabad,</p>
                    <p>Uttar Pradesh 201002</p>
                  </div>
                </div>
              </li>

              <li className="group">
                <a
                  href="mailto:drshirleyma@yahoo.co.in"
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="p-2 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    drshirleyma@yahoo.co.in
                  </span>
                </a>
              </li>

              <li className="group">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300">
                  <div className="p-2 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  </div>
                  <div className="text-sm text-gray-400">
                    <p className="font-medium text-white mb-1">Working Hours</p>
                    <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                    <p className="text-red-400">Sunday: Closed</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div> 
      </div>

      {/* Bottom Bar - Enhanced */}
      <div className="relative border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© {currentYear} O Dental Clinic. All rights reserved.</span>
             
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                to="/sitemap"
                className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button - Optional */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Scroll to top"
      >
        <ArrowUpRight className="w-5 h-5 rotate-45 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </footer>
  );
}

export default Footer;