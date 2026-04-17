import React from "react";
import { Mail, Linkedin, Globe } from "lucide-react";
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

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const AboutFounders: React.FC = () => {
  return (
    <section className="py-20 bg-secondary/50 dark:bg-secondary/20">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Heading */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={slideLeft}
        >
          <h2 className="text-4xl font-heading font-bold text-primary">
            Founders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A dedicated group of AI engineers, developers, and automation
            specialists committed to transforming how businesses operate.
          </p>
        </motion.div>

        {/* Founder Cards */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Siddhartha - Slide from Left */}
          <motion.div
            className="space-y-6 text-left group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideLeft}
          >
            <motion.div
              className="relative overflow-hidden rounded-[2.5rem] aspect-square shadow-xl bg-muted"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://i.postimg.cc/jdb4dkY2/siddhartha.jpg"
                alt="Er. Siddhartha Pathak"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div className="space-y-4 px-2" variants={staggerContainer}>
              <h3 className="text-2xl font-bold text-primary dark:text-white">
                Er. Siddhartha Pathak
              </h3>
              <p className="text-muted-foreground font-medium">
                Founder | Director | CTO
              </p>
              <div className="flex space-x-5">
                <a
                  href="mailto:info@leafclutchtech.com.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email me"
                >
                  <Mail className="w-5 h-5 text-accent cursor-pointer hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://linkedin.com/in/siddharthapathak"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 text-accent cursor-pointer hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://siddharthapathak.com.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="w-5 h-5 text-accent cursor-pointer hover:scale-110 transition-transform" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Shubham - Slide from Right */}
          <motion.div
            className="space-y-6 text-left group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideRight}
          >
            <motion.div
              className="relative overflow-hidden rounded-[2.5rem] aspect-square shadow-xl bg-muted"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://i.postimg.cc/pdFmjRDx/shubham.jpg"
                alt="Shubham Kumar Deo"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div className="space-y-4 px-2" variants={staggerContainer}>
              <h3 className="text-2xl font-bold text-primary dark:text-white">
                Shubham Kumar Deo
              </h3>
              <p className="text-muted-foreground font-medium">
                Co-Founder | CEO
              </p>
              <div className="flex space-x-5">
                <a
                  href="mailto:subhamleafclutch@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email me"
                >
                  <Mail className="w-5 h-5 text-accent cursor-pointer hover:scale-110 transition-transform" />
                </a>

                <a
                  href="https://www.linkedin.com/in/shubham-kumar-deo-7048ab29b/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 text-accent cursor-pointer hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://project-shubhamportfolio11.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="w-5 h-5 text-accent cursor-pointer hover:scale-110 transition-transform" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutFounders;
