export interface StaticService {
  title: string;
  description: string;
  slug: string;
  features: string[];
  lottie: string;
}

export const SERVICES_DATA: StaticService[] = [
  {
    title: "Web Development",
    description:
      "Creating high-performance, responsive websites and modern web applications tailored to your business goals.",
    slug: "web-development",
    features: ["Custom Web Apps", "E-commerce", "CMS Solutions", "API Development"],
    lottie: "/Gifs/web.lottie",
  },
  {
    title: "Mobile App Development",
    description:
      "Building intuitive and feature-rich Android and iOS applications that provide exceptional user experiences.",
    slug: "mobile-development",
    features: ["iOS Apps", "Android Apps", "Cross-platform", "App Maintenance"],
    lottie: "/Gifs/mobile.lottie",
  },
  {
    title: "DevOps Solutions",
    description:
      "Optimizing development workflows and maintaining secure, scalable cloud infrastructure for enterprise-grade stability.",
    slug: "devops",
    features: ["Cloud Migration", "CI/CD Pipelines", "Docker & K8s", "Infrastructure as Code"],
    lottie: "/Gifs/devops.lottie",
  },
  {
    title: "Data Science & AI",
    description:
      "Harnessing the power of machine learning and big data to drive intelligent decision-making and automate operations.",
    slug: "data-science",
    features: ["ML Models", "Data Analytics", "AI Integration", "Automation"],
    lottie: "/Gifs/ai.lottie",
  },
  {
    title: "Cybersecurity",
    description:
      "Protecting your digital assets with advanced threat detection, data encryption, and comprehensive security audits.",
    slug: "cybersecurity",
    features: ["Security Audits", "Data Protection", "Incident Response", "Network Security"],
    lottie: "/Gifs/cyber.lottie",
  },
  {
    title: "Digital Marketing",
    description:
      "Boosting your brand's online visibility and growth through data-driven strategies and targeted search optimization.",
    slug: "digital-marketing",
    features: ["SEO", "Social Media", "PPC Campaigns", "Content Strategy"],
    lottie: "/Gifs/marketing.lottie",
  },
];