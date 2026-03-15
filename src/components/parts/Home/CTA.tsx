import React from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOut } },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: easeOut } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const CTA: React.FC = () => {
  return (
    <section className="section-padding px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-[95rem] mx-auto bg-gradient-to-br from-primary to-blue-600 border border-white/10 rounded-[2rem] p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 text-white relative overflow-hidden shadow-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Animated Background Glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>

        {/* Text Content */}
        <motion.div
          className="text-left space-y-8 max-w-2xl relative z-10"
          variants={slideLeft}
        >
          <h2 className="text-5xl md:text-6xl font-heading font-extrabold leading-[1.1] tracking-tight">
            Ready to <br /> Transform Your <br />
            <span className="text-cyan-400">Business?</span>
          </h2>
          <p className="text-slate-300 text-xl md:text-xl leading-relaxed max-w-xl">
            Let's discuss how our solutions can help you achieve your goals. Get
            a free consultation with our experts.
          </p>
          <div className="flex flex-wrap gap-5 pt-4">
            <Link to="/contact">
              <motion.button
                className="text-[1.2rem] px-10 py-4 bg-white text-[#0A192F] font-extrabold rounded-full flex justify-center items-center space-x-3 hover:scale-105 transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* QR & Email */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full lg:w-auto"
          variants={slideRight}
        >
          <a
            href="https://discord.gg/4aDwcMZBPq"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="bg-white rounded-[1rem] shadow-[0_0_50px_rgba(255,255,255,0.15)] text-center flex flex-col items-center group transition-transform hover:rotate-2">
              <img src="/qr.png" alt="Discord QR" className="rounded-[1rem]" />
            </div>
          </a>

          <a
            href="mailto:info@leafclutchtech.com.np"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="p-5 bg-white/5 backdrop-blur-xl rounded-[1rem] border border-white/10 flex items-center space-x-5 shadow-2xl group hover:bg-white/10 transition-all cursor-pointer w-full md:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-400 rounded-2xl flex items-center justify-center text-[#0A192F] group-hover:rotate-12 transition-transform">
                <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="text-left">
                <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.2em] mb-1">
                  Email us
                </p>
                <p className="text-base sm:text-xl font-bold tracking-tight">
                  info@leafclutchtech.com.np
                </p>
              </div>
            </div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTA;
