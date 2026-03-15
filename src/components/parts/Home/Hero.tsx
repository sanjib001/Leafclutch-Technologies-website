import React from "react";
import { motion, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";

// const GIF_SRC =
//   "https://lottie.host/99019f1e-2787-4491-909e-a1b55b5e34d6/ZZ5PylhsXR.lottie";
const GIF_SRC = "/Gifs/tech-startup.lottie";

// const HERO_BG = "https://i.postimg.cc/N05X153v/Hero-Bg-Image.jpg";

// const heroBackground: React.CSSProperties = {
//   backgroundImage: `
//     linear-gradient(
//       180deg,
//       rgba(30, 32, 37, 0.88),
//       rgba(42, 45, 58, 0.92)
//     ),
//     url(${HERO_BG})
//   `,
// };

const Hero: React.FC = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <section className="relative bg-background overflow-hidden pt-12 pb-20 min-h-[90vh] flex flex-col justify-center transition-colors duration-500">
      <div className="grid grid-cols-1 place-items-center lg:grid-cols-2 max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          className="max-w-4xl space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-full border border-primary/20 bg-accent/10 dark:border-sky-500/30 dark:bg-[#0A192F]/80 backdrop-blur-md text-primary dark:text-mint"
            variants={fadeInLeft}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[0.8rem] font-bold tracking-wider uppercase">
              Enterprise Software & AI Automation
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div className="space-y-2" variants={fadeInUp}>
            <h1 className="text-[56px] md:text-[6rem] font-heading font-extrabold tracking-tight leading-[1] text-primary dark:text-white">
              We build <br />
              intelligent <br />
              <span className="bg-gradient-to-r from-accent via-primary to-blue-600 dark:from-[#22D3EE] dark:via-[#0EA5E9] dark:to-[#3B82F6] bg-clip-text text-transparent">
                Software & AI.
              </span>
            </h1>
          </motion.div>

          {/* Paragraph */}
          <motion.p
            className="text-xl md:text-[1.3rem] text-muted-foreground max-w-3xl leading-relaxed font-medium"
            variants={fadeInUp}
          >
            Leafclutch Technologies delivers mission-critical engineering and{" "}
            <span className="text-foreground font-bold">
              responsible AI automation
            </span>{" "}
            tailored for enterprise scale.
          </motion.p>

          {/* Buttons */}
          <motion.div className="flex flex-wrap gap-6 pt-4" variants={fadeInUp}>
            <Link to="/contact">
              <motion.button
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold flex justify-center items-center space-x-3 hover:opacity-90 transition-all transform hover:-translate-y-1 active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">Get Started</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
            <Link to="/others/our-projects">
              <motion.button
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-border text-foreground rounded-full font-bold hover:bg-secondary transition-all text-xl active:scale-95"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Our Work
              </motion.button>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div
            className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl dark:border-white/10"
            variants={containerVariants}
          >
            {[
              { icon: Shield, label: "Enterprise-Ready" },
              { icon: Zap, label: "High Performance" },
              { icon: Sparkles, label: "Responsible AI" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-center space-x-3 group"
                variants={fadeInUp}
              >
                <item.icon className="w-6 h-6 text-accent dark:text-[#38BDF8]" />
                <span className="text-[13px] font-bold tracking-[0.15em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Lottie */}
        <div className="hidden lg:flex justify-center items-center w-[70%] h-[70%] place-self-center">
          <DotLottieReact src={GIF_SRC} loop autoplay />
        </div>
      </div>
    </section>
  );
};

export default Hero;
