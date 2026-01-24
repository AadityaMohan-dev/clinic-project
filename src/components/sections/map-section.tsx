import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonColorful } from '../ui/button-colorful';


export default function MapSection() {
  // 1. The specific Place ID for O' Dental Clinic ensures accuracy
  // We use this for the "Get Directions" link
  const placeName = "O Dental Clinic";
  const addressQuery = "O Dental Clinic, KD-108, Kavi Nagar, Ghaziabad";
  
  // This link opens Google Maps in Directions mode: [Current Location] -> [Clinic]
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressQuery)}`;

  return (
    <section className="relative w-full py-20 px-6 md:px-12 bg-transparent">
      <div className="max-w-[1400px] mx-auto w-full">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center mb-12 text-center"
        >
           <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
             Visit Our Clinic
           </h2>
           <p className="mt-4 text-neutral-500 text-lg">
             Conveniently located in Kavi Nagar, Ghaziabad.
           </p>
        </motion.div>

        {/* Map & Info Container */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white/50 backdrop-blur-sm border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm"
        >
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-1 flex flex-col gap-8 justify-center">
            
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-neutral-900">Address</h3>
                <p className="text-neutral-600 leading-relaxed mt-1">
                  KD-108, Block D, Sector 18,<br />
                  Kavi Nagar, Ghaziabad - 201002
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-neutral-900">Contact</h3>
                <p className="text-neutral-600 mt-1">
                  +91 98182 31620<br />
                  0120-4211814
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-neutral-900">Timings</h3>
                <p className="text-neutral-600 mt-1">
                  9:00 AM - 1:00 PM<br />
                  4:00 PM - 8:00 PM<br />
                  <span className="text-sm text-neutral-400"></span>
                </p>
                {/* Book Appointment Button */}
        <div className="-mr-2">
            <ButtonColorful 
              label="Book Appointment" 
              onClick={() => console.log("Booking clicked")}
            />
        </div>
              </div>
            </div>

          </div>

          {/* Right: Map Interactive Container */}
          {/* We wrap the map in an anchor tag so the WHOLE area is clickable */}
          <a 
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-2 h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 relative group cursor-pointer"
          >
            {/* "Get Directions" Overlay - Appears on Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur text-neutral-900 px-6 py-3 rounded-full font-bold shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                    <Navigation size={18} className="text-blue-600 fill-blue-600" />
                    Get Directions
                </div>
            </div>

            {/* Actual Map Iframe */}
            {/* Using standard query embed to ensure exact name match */}
            <iframe 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              loading="lazy" 
              title="O Dental Clinic Location"
              className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </a>

        </motion.div>
      </div>
    </section>
  );
}