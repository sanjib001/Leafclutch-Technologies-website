import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA: React.FC = () => {
  return (
    <section className="py-24 bg-primary px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
          Ready to Start Your Project?
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
          Let's discuss how we can help bring your vision to life.
        </p>

        <div className="flex sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <button className="flex items-center justify-center gap-2 bg-card text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-background transition-colors shadow-lg">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
