import React from "react";
import { ArrowRight, 
  // Sparkles 
} from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  backgroundImage: string;
  backgroundSize?: "cover" | "contain" | "auto" | string; // allow custom size
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  icon,
  backgroundImage,
  backgroundSize = "cover",
}) => {
  const heroBackground: React.CSSProperties = {
    backgroundImage: `
  linear-gradient(
    rgba(9, 5, 54, 0.55),
    rgba(5, 4, 46, 0.85)
  ),
  url(${backgroundImage})
`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: backgroundSize,
  };
  return (
    <section
      style={heroBackground}
      className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden"
    >
      <div className="container-custom relative z-10 text-center text-white">
        <div className="animate-fade-in-up">
          {/* Floating Icon Card */}
          <div className="inline-flex items-center justify-center p-5  rounded-3xl mb-8 border-white/30 animate-float shadow-2xl">
            {icon}
          </div>

          {/* Elegant Subtitle */}
          <div className="flex justify-center mb-1">
            <span className="flex items-center px-4 py-2 rounded-full  border-white/20 text-xs md:text-sm font-bold tracking-widest uppercase text-mint text-glow">
              {/* <Sparkles className="w-4 h-4 mr-2" /> */}
              {subtitle}
            </span>
          </div>

          {/* Epic Heading */}
          <h1 className="text-4xl md:text-6xl font-black mb-[5rem] leading-tight drop-shadow-lg tracking-normal">
            {title}
          </h1>

          {/* Balanced Description */}
          {/* <p className="max-w-3xl mx-auto text-base md:text-xl text-white/90 mb-10 leading-relaxed font-medium drop-shadow">
            {description}
          </p> */}

          {/* High-Impact CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/contact">
              <button className="relative group w-full sm:w-auto px-10 py-4 bg-white hover:bg-[#ccc] text-primary dark:text-blue-950 font-bold rounded-2xl transition-all flex items-center justify-center overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" /> */}
              </button>
              {/* <button className="relative w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl flex items-center justify-center">
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </button> */}
            </Link>

            {/* <button className="w-full sm:w-auto px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 transition-all shadow-xl">
              Learn More
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
