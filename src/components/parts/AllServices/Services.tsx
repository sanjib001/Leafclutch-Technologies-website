import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import {
  serviceApi,
  type ServiceResponse,
} from "../../../services/serviceService";
import Gifs from "./Gifs";
import ServiceCardSkeleton from "./ServiceCardSkeleton";

// interface LocalServiceCardProps {
//   id: string;
//   title: string;
//   description: string;
//   features: string[];
//   href: string;
//   icon: React.ReactNode;
// }

const RenderServiceMedia = ({ service }: { service: ServiceResponse }) => {
  const animations: Record<string, string> = {
    "Web Development": "/Gifs/web.lottie",
    "Mobile App Development": "/Gifs/mobile.lottie",
    "DevOps Solutions": "/Gifs/devops.lottie",
    Cybersecurity: "/Gifs/cyber.lottie",
    "Data Science & AI": "/Gifs/ai.lottie",
    "Digital Marketing": "/Gifs/marketing.lottie",
  };

  const lottieSrc = animations[service.title];

  // 1. Try Lottie/Gif first to keep the original "AI shine"
  if (lottieSrc) {
    return <Gifs src={lottieSrc} className="h-[12rem] w-full" />;
  }

  // 2. Try Backend Photo next
  if (service.photo_url) {
    return (
      <div className="h-[12rem] w-full overflow-hidden rounded-2xl border border-border/50">
        <img
          src={service.photo_url}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    );
  }

  // 3. Fallback Icon if nothing else exists
  return (
    <div className="h-[12rem] w-full flex items-center justify-center bg-primary/5 rounded-2xl">
      <LayoutGrid size={64} className="text-mint/50" />
    </div>
  );
};

const ServiceCard: React.FC<{
  service: ServiceResponse;
  index: number;
}> = ({ service, index }) => {
  // console.log(service);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2F4F7] dark:bg-slate-800/50 rounded-bl-full -z-0 opacity-50 transition-colors" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-1/2 h-[12rem] flex items-center justify-center text-primary dark:text-mint mb-4 ">
          <div className="p-6 bg-mint/10">
            {/* <LayoutGrid size={48} className="text-mint" /> */}
            <RenderServiceMedia service={service} />
          </div>
        </div>

        <h3 className="text-3xl font-bold mb-4 text-[#081E67] dark:text-white tracking-tight text-center">
          {service.title}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center leading-relaxed text-base font-normal max-w-[90%] line-clamp-3">
          {service.description}
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-10">
          {service.offerings.slice(0, 4).map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00d9a5] flex items-center justify-center shadow-sm">
                <Check size={12} strokeWidth={4} className="text-white" />
              </div>
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>

        <Link to={`/services/${service.id}`}>
          <button className="w-full flex items-center justify-between p-4 px-6 rounded-xl border border-mint/40 dark:border-mint/20 hover:bg-primary/10 dark:hover:bg-mint/10 transition-all group/btn">
            <span className="text-lg font-bold text-[#14b8a6] dark:text-mint">
              Learn More
            </span>
            <div className="text-[#14b8a6] dark:text-mint transition-transform duration-300 group-hover/btn:translate-x-1">
              <ArrowRight size={22} />
            </div>
          </button>
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#081E67] via-[#14b8a6] to-[#2dd4bf] opacity-90" />
    </motion.div>
  );
};

const Services: React.FC = () => {
  const [dbServices, setDbServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // FIXED: Changed companyApi.getServices() to serviceApi.getAll()
        const data = await serviceApi.getAll();

        // Safety check to ensure data is an array
        const serviceData = Array.isArray(data) ? data : [];

        const sortedServices = serviceData.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );

        // const mapped = sortedServices.map((s: ServiceResponse) => ({
        //   id: s.id,
        //   title: s.title,
        //   description: s.description,
        //   features: s.offerings || [], // Added fallback for offerings
        //   href: `/services/${s.id}`,
        //   icon: null,
        // }));

        setDbServices(sortedServices);
      } catch (err) {
        console.error("Failed to load services grid", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <section
      id="services"
      className="py-24 bg-[#f8fafc] dark:bg-slate-950 border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            Our Portfolio
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-primary dark:text-white">
            Available Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ServiceCardSkeleton key={index} index={index} />
              ))
            : dbServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
