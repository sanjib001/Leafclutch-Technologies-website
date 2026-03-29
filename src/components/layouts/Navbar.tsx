import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, MessageSquare } from "lucide-react";
// import { LuCircleUserRound } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { serviceApi } from "../../services/serviceService";

// --- STATIC DATA (Immediate Load) ---
const careers = [
  { name: "Jobs", href: "/careers/jobs" },
  { name: "Internships", href: "/careers/internships" },
];

const others = [
  { name: "Blog", href: "/others/blog" },
  { name: "Verify Certificate", href: "/others/verify-certificate" },
  { name: "Our Projects", href: "/others/our-projects" },
];

const staticServices = [
  { name: "All Services", href: "/services/all-services" },
  { name: "Web Development", href: "/services/web-development" },
  { name: "Mobile App Development", href: "/services/mobile-development" },
  { name: "DevOps Solutions", href: "/services/devops" },
  { name: "Cybersecurity", href: "/services/cybersecurity" },
  { name: "Data Science & AI", href: "/services/data-science" },
  { name: "Digital Marketing", href: "/services/digital-marketing" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Initialize with static data so the UI is never empty
  const [dynamicServices, setDynamicServices] = useState(staticServices);

  const location = useLocation();

  useEffect(() => {
    const getNavbarData = async () => {
      try {
        const data = await serviceApi.getAll();

        // Map API data using IDs for the href
        const mappedApiServices = data
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime(),
          )
          .map((s) => ({
            name: s.title,
            href: `/services/${s.id}`,
          }));

        // MERGE LOGIC: Keep static ones, add API ones only if the name is unique
        const uniqueApiServices = mappedApiServices.filter(
          (apiItem) =>
            !staticServices.some(
              (staticItem) =>
                staticItem.name.toLowerCase() === apiItem.name.toLowerCase(),
            ),
        );

        // Update state in background
        setDynamicServices([...staticServices, ...uniqueApiServices]);
      } catch (err) {
        console.error(
          "Background sync failed, staying with static services:",
          err,
        );
      }
    };

    getNavbarData();
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    {
      name: "Training & Internship",
      href: "https://www.leafclutchtech.com.np/courses",
      target: "_blank",
    },
    { name: "Services", href: "/services", dropdown: dynamicServices },
    { name: "Careers", href: "/careers", dropdown: careers },
    { name: "Others", href: "/others", dropdown: others },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-card backdrop-blur-lg">
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img
              src="/logo-new.png"
              alt="Leafclutch Logo"
              className="h-14 lg:h-10 xl:h-14"
            />
          </Link>

          {/* -------- Desktop Navigation -------- */}
          <div className="hidden lg:flex items-center lg:text-xs min-[1150px]:text-sm lg:gap-[0vw] min-[1095px]:gap-[0.5vw] min-[1150px]:gap-[1vw] min-[1355px]:text-base min-[1355px]:gap-[2vw]">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`nav-link flex items-center gap-1 rounded-md px-3 py-2 ${
                      location.pathname.startsWith(link.href)
                        ? "text-primary font-bold active"
                        : "font-semibold"
                    }`}
                  >
                    {link.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 w-56 bg-card mt-0.5 rounded-md shadow-lg border border-gray-100 dark:border-gray-700 z-10"
                      >
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href} // Uses pretty string OR API ID
                            className="block px-4 py-2 text-muted-foreground hover:bg-muted rounded-md transition-colors duration-150"
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              setOpenDropdown(null);
                            }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : link.target === "_blank" ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`nav-link rounded-md px-3 py-2 ${isActive(link.href) ? "text-primary font-bold active" : "font-semibold"}`}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`nav-link rounded-md px-3 py-2 ${isActive(link.href) ? "text-primary font-bold active" : "font-semibold"}`}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 md:gap-10">
            <div className="hidden lg:flex space-x-2 items-center">
              <Link
                to="/contact"
                className="flex items-center"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <Button
                  variant="outline"
                  className="xl:!h-12 md:!h-10 lg:text-xs min-[1200px]:text-sm lg:gap-[1vw] xl:text-base xl:gap-[0.5vw]"
                >
                  <MessageSquare className="xl:!w-6 xl:!h-6 md:!w-5 md:!h-5" />
                  Contact
                </Button>
              </Link>

              <a
                href="https://leafclutch-dashboard.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                {/* <Button className="xl:!h-12 md:!h-10 lg:text-xs min-[1200px]:text-sm lg:gap-[1vw] xl:text-base xl:gap-[0.5vw]">
                  <LuCircleUserRound className="xl:!w-7 xl:!h-7 md:!w-6 md:!h-6" />
                  Login
                </Button> */}
              </a>
            </div>

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="!h-6 !w-6" />
              ) : (
                <Menu className="!h-6 !w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed top-20 inset-x-0 bottom-0 z-50 bg-white border-t"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <div className="h-auto border-b overflow-y-auto bg-card px-4 py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isDropdownOpen = openDropdown === link.name;
                  return (
                    <div key={link.name}>
                      {link.dropdown ? (
                        <>
                          <button
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium"
                            onClick={() =>
                              setOpenDropdown(isDropdownOpen ? null : link.name)
                            }
                          >
                            <span>{link.name}</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          {isDropdownOpen && (
                            <div className="ml-4 mt-1 flex flex-col gap-1 border-l pl-3">
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  className="rounded-md px-3 py-2 text-sm text-muted-foreground"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    window.scrollTo(0, 0);
                                  }}
                                >
                                  {item.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={link.href}
                          className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
