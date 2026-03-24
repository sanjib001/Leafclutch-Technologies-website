import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "../components/layouts/Layout";

import Job from "../pages/careers/Job";
import Blog from "../pages/others/Blog";
import VerifyCertificate from "../pages/others/VerifyCertificate";
import OurProjects from "../pages/others/OurProjects";
import NotFound from "../components/ui/NotFound";
import Internship from "../pages/careers/Internship";
import Home from "../pages/Home";
import AllServices from "../pages/Services/AllServices";
import Services from "../pages/Services/Services";
import { ScrollToTop } from "./ScrollToTop";
import TrainingInternship from "../pages/careers/TrainingInternship";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import InternshipDetails from "../components/parts/AboutUs/InternDetails";
import CourseDetailPage from "../pages/CourseDetailPage";
import MentorDetails from "../components/parts/AboutUs/MentorDetails";
import Form from "../pages/form/form";
import PrivacyPolicy from "../pages/Privacy";
import TermsOfService from "../pages/Terms";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/intern-details" element={<InternshipDetails />} />
          <Route path="/mentor-details" element={<MentorDetails />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/course/all" element={<TrainingInternship />} />
          <Route path="/course/form" element={<Form />} />
          <Route path="/course/:slug" element={<CourseDetailPage />} />
          <Route path="/careers/jobs" element={<Job />} />
          <Route path="/careers/internships" element={<Internship />} />
          <Route path="/others/blog" element={<Blog />} />
          <Route
            path="/others/verify-certificate"
            element={<VerifyCertificate />}
          />
          <Route path="/others/our-projects" element={<OurProjects />} />
          <Route path="/services/all-services" element={<AllServices />} />

          <Route path="/services/:slug" element={<Services />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
