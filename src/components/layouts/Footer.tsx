import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { TbBrandTiktok, TbBrandDiscord } from "react-icons/tb";
import { serviceApi } from "../../services/serviceService";
// import { trainingApi } from "../../services/trainingService";

// Types
type ServiceItem = Awaited<ReturnType<typeof serviceApi.getAll>>[number];
// type TrainingItem = Awaited<ReturnType<typeof trainingApi.getAll>>[number];

const company = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  {
    name: "Training & Internship",
    href: "https://www.leafclutchtech.com.np/courses",
    target: "_blank",
  },
  { name: "Services", href: "/services/all-services" },
  { name: "Careers", href: "/careers/jobs" },
  { name: "Contact", href: "/contact" },
];

const resources = [
  { name: "Blog & Insights", href: "/others/blog" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const staticServices = [
  { name: "All Services", slug: "all-services" },
  { name: "Web Development", slug: "web-development" },
  { name: "Mobile App Development", slug: "mobile-development" },
  { name: "DevOps Solutions", slug: "devops" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "Data Science & AI", slug: "data-science" },
  { name: "Digital Marketing", slug: "digital-marketing" },
];

const socials = [
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61584902195796",
    label: "Facebook",
  },
  { icon: Twitter, href: "https://x.com/", label: "Twitter" },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/leafclutch-technologies/",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/leafclutch.technologies/",
    label: "Instagram",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@LeafclutchTechnologies",
    label: "YouTube",
  },
  {
    icon: TbBrandTiktok,
    href: "https://www.tiktok.com/@leafclutchtechnologies1",
    label: "Tiktok",
  },
  {
    icon: TbBrandDiscord,
    href: "https://discord.gg/4aDwcMZBPq",
    label: "Discord",
  },
];

export function Footer() {
  // 1. Initialize immediately with static data (using slugs as IDs)
  const [dynamicServices, setDynamicServices] = useState<ServiceItem[]>(
    staticServices.map(
      (s) =>
        ({
          id: s.slug,
          title: s.name,
          created_at: new Date(0).toISOString(),
        }) as ServiceItem,
    ),
  );
  // const [dynamicTrainings, setDynamicTrainings] = useState<TrainingItem[]>([]);

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const [sRes] = await Promise.all([
          serviceApi.getAll(),
          // trainingApi.getAll(),
        ]);

        const services = Array.isArray(sRes) ? sRes : [];
        // const trainings = Array.isArray(tRes) ? tRes : [];

        // 2. Logic: Keep static slugs and only append new API items
        setDynamicServices((prevStatic) => {
          // Normalize static titles for comparison
          const staticTitles = new Set(
            prevStatic.map((s) => s.title.toLowerCase().trim()),
          );

          // Filter API response: only keep items that are NOT in the static list
          const newApiItems = services.filter(
            (apiItem) => !staticTitles.has(apiItem.title.toLowerCase().trim()),
          );

          // Return the original static items (keeping their slugs) + brand new items (keeping their IDs)
          return [...prevStatic, ...newApiItems];
        });

        // setDynamicTrainings(trainings);
      } catch (err) {
        console.error("Footer background sync failed:", err);
      }
    };
    fetchFooterContent();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-custom py-16 md:pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" onClick={scrollToTop}>
              <img src="/logo-new.png" alt="Leafclutch Logo" className="h-16" />
            </Link>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Empowering innovation through cutting-edge technology solutions,
              training, and digital transformation services.
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="mailto:info@leafclutchtech.com.np"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> info@leafclutchtech.com.np
              </a>
              <a
                href="tel:+9779766715768"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4" /> +977-9766715768
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> Siddharthanagar, Rupandehi
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-base font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {company.map((link) => (
                <li key={link.name}>
                  {link.target === "_blank" ? (
                    <a
                      href={link.href}
                      target={link.target}
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      onClick={scrollToTop}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {dynamicServices.map((item) => (
                <li key={item.title}>
                  <Link
                    to={`/services/${item.id}`} // item.id is either a slug (static) or a UUID (API extra)
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    onClick={scrollToTop}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    onClick={scrollToTop}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-[88rem] mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Leafclutch Technologies. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              onClick={scrollToTop}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              onClick={scrollToTop}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
            <a
              href="https://leafclutch-technologies-website.vercel.app/admin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
