import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Shield} from "lucide-react";
import Spinner from "../../components/ui/Spinner";

import {
  serviceApi,
  type ServiceResponse,
} from "../../services/serviceService";
import { services as STATIC_SERVICES } from "../../components/parts/Services/data";
import NotFound from "../../components/ui/NotFound";
import Hero from "../../components/parts/Services/Hero";
import Features from "../../components/parts/Services/Features";
import Benefits from "../../components/parts/Services/Benefits";
import Technologies from "../../components/parts/Services/Technologies";
import FinalCTA from "../../components/parts/Services/FinalCTA";

// Updated Interface to match ReactNode expectations
interface MappedService {
  title: string;
  subtitle: string;
  icon: React.ReactNode | string | null;
  heroImage: string;
  backgroundSize: string;
  features: string[];
  benefits: { 
    title: string; 
    description: string; 
    icon: React.ReactNode // Changed from ReactElement to ReactNode
  }[];
  technologies: string[];
}

export default function Services() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<MappedService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!slug || slug === "all-services") {
        setLoading(false);
        return;
      }

      setLoading(true);

      // 1. CHECK STATIC CONSTANTS FIRST (Key-based lookup)
      const staticData = STATIC_SERVICES[slug as keyof typeof STATIC_SERVICES];

      if (staticData) {
        setService({
          title: staticData.title,
          subtitle: staticData.subtitle,
          icon: staticData.icon,
          heroImage: staticData.heroImage,
          backgroundSize: staticData.backgroundSize || "cover",
          features: staticData.features,
          technologies: staticData.technologies,
          // Map to ensure icons are never undefined (Fixes the TS Error)
          benefits: staticData.benefits.map((b) => ({
            title: b.title,
            description: b.description,
            icon: b.icon || <Shield className="w-6 h-6" />, 
          })),
        });
        setLoading(false);
        return; 
      }

      // 2. FALLBACK TO API (If slug is an ID)
      try {
        const data: ServiceResponse = await serviceApi.getById(slug);

        if (data) {
          setService({
            title: data.title,
            subtitle: "", 
            icon: null,
            heroImage: data.photo_url || "/default-hero.jpg",
            backgroundSize: "cover",
            features: data.offerings || [],
            technologies: data.techs || [],
            // Fallback benefits from a static entry to maintain UI quality
            benefits: STATIC_SERVICES["web-development"].benefits.map((b) => ({
              title: b.title,
              description: b.description,
              icon: b.icon || <Shield className="w-6 h-6" />,
            })),
          });
        } else {
          setService(null);
        }
      } catch (err) {
        console.error("Service fetch failed for slug/id:", slug, err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!service) {
    return <NotFound />;
  }

  return (
    <div className="animate-in fade-in duration-700">
      <Hero
        title={service.title}
        subtitle={service.subtitle}
        icon={service.icon}
        backgroundImage={service.heroImage}
        backgroundSize={service.backgroundSize}
      />
      <Features features={service.features} />
      <Benefits benefits={service.benefits} />
      <Technologies technologies={service.technologies} />
      <FinalCTA />
    </div>
  );
}