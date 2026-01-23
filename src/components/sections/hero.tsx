import { Copy, Grip } from 'lucide-react'; // 'Grip' looks like the menu dots
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full pt-6 pb-20 px-6 md:px-12 flex flex-col bg-white overflow-hidden">
      
      {/* --- HEADER (Logo + Menu) --- */}
      {/* This matches the top of your mobile screenshot */}
      <nav className="flex justify-between items-center w-full mb-12 md:mb-20 max-w-[1400px] mx-auto">
        <span className="text-xl font-bold tracking-tight uppercase">YUYA</span>
        <button className="p-2 -mr-2 text-neutral-900">
          <Grip size={28} /> 
        </button>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-2 md:gap-16">
        
        {/* ROW 1: .YUME Text + Image */}
        {/* Mobile: Flex Column (Image First). Desktop: Flex Row (Text First) */}
        <div className="relative flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-0">
          
          {/* IMAGE */}
          {/* order-1 on mobile (first), order-2 on desktop (last/right) */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="order-1 md:order-2 self-start md:self-end md:mb-12"
          >
             <div className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden bg-neutral-100">
               <img 
                 src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400" 
                 alt="Portrait" 
                 className="w-full h-full object-cover"
               />
             </div>
          </motion.div>

          {/* TEXT: .YUME */}
          {/* order-2 on mobile (second), order-1 on desktop (first/left) */}
          <motion.h1 
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="order-2 md:order-1 text-[23vw] md:text-[13rem] leading-[0.8] font-bold tracking-tighter text-neutral-950 mt-4 md:mt-0"
          >
            .YUME
          </motion.h1>

        </div>

        {/* ROW 2: YASKUMI */}
        <div className="-mt-2 md:-mt-16">
           <motion.h1 
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
             className="text-[23vw] md:text-[13rem] leading-[0.8] font-bold tracking-tighter text-neutral-950"
           >
            YASKUMI
          </motion.h1>
        </div>

        {/* ROW 3: Contact & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mt-16 md:mt-12 items-start">
          
          {/* Left: Email */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 flex items-center gap-2"
          >
            <span className="text-lg md:text-xl font-medium">hello@yume.com</span>
            <button 
              onClick={() => navigator.clipboard.writeText('hello@yume.com')}
              className="p-1 hover:bg-neutral-100 rounded transition-colors"
              aria-label="Copy email"
            >
              <Copy size={16} />
            </button>
          </motion.div>

          {/* Spacer for desktop layout */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Right: Bio Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-6"
          >
            <p className="text-xl md:text-4xl font-normal leading-snug md:leading-snug text-neutral-900">
              Hello, I'm a freelancer specializing in minimal design with 10 years of expertise — based in Tokyo, working remote. Let's create!
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}