import { motion } from "framer-motion";
import {  Mail, Phone, MapPin } from "lucide-react";
// import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      {/* <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-brand-dark hover:text-brand-teal transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-brand-teal" size={24} />
            <span className="font-bold text-lg tracking-tight">Privacy Center</span>
          </div>
        </div>
      </nav> */}

      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <header className="mb-12 border-b border-slate-100 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Privacy Policy</h1>
            <p className="text-slate-500 font-medium italic">Last updated: March 9, 2026</p>
          </header>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <p className="mb-6">
                Leafclutch Technologies Pvt. Ltd. (“we,” “us,” or “our”) is committed to protecting the privacy of our website visitors, students, and users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://leafclutchtech.com.np" className="font-semibold text-brand-teal" target="_blank" rel="noopener noreferrer">leafclutchtech.com.np</a> or enroll in our programs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                Information We Collect
              </h2>
              <div className="space-y-6 ml-11">
                <div>
                  <h3 className="font-bold text-brand-dark mb-2">Personal Information</h3>
                  <p className="mb-3">When you enroll in our programs, contact us, or interact with our website, we may collect:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>LinkedIn profile URL (optional)</li>
                    <li>Current semester / educational status</li>
                    <li>Course preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark mb-2">Automatically Collected Information</h3>
                  <p className="mb-3">When you visit our website, we may automatically collect certain information, including:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device type and operating system</li>
                    <li>Pages visited and time spent</li>
                    <li>Referring website or source</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                How We Use Your Information
              </h2>
              <div className="ml-11">
                <p className="mb-3">We use the collected information to:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Process your enrollment and training applications</li>
                  <li>Communicate with you about programs, schedules, and updates</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send relevant educational content and announcements</li>
                  <li>Improve our website, programs, and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                How We Share Your Information
              </h2>
              <div className="ml-11">
                <p className="mb-4">We do <span className="font-bold">not</span> sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="space-y-4">
                  <li>
                    <span className="font-bold text-brand-dark">Service Providers:</span> With trusted third-party services (e.g., email, hosting, analytics) that help us operate our website and programs, under strict confidentiality agreements.
                  </li>
                  <li>
                    <span className="font-bold text-brand-dark">Legal Requirements:</span> When required by law, court order, or governmental regulation.
                  </li>
                  <li>
                    <span className="font-bold text-brand-dark">With Your Consent:</span> When you explicitly agree to share your information for a specific purpose.
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                Data Security
              </h2>
              <div className="ml-11">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">5</span>
                Third-Party Links
              </h2>
              <div className="ml-11">
                <p>
                  Our website may contain links to third-party websites (e.g., LinkedIn, WhatsApp, Udemy). We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">6</span>
                Cookies
              </h2>
              <div className="ml-11">
                <p>
                  Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of the website.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">7</span>
                Your Rights
              </h2>
              <div className="ml-11">
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 mb-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt out of marketing communications at any time</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at <a href="mailto:info@leafclutchtech.com.np" className="text-brand-teal font-semibold hover:underline">info@leafclutchtech.com.np</a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">8</span>
                Children's Privacy
              </h2>
              <div className="ml-11">
                <p>
                  Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child under 16, we will take steps to delete that information.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">9</span>
                Changes to This Policy
              </h2>
              <div className="ml-11">
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated “Last updated” date. We encourage you to review this policy periodically.
                </p>
              </div>
            </section>

            <section className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
              <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">10</span>
                Contact Us
              </h2>
              <div className="ml-11 space-y-4">
                <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={18} className="text-brand-teal" />
                    <a href="mailto:info@leafclutchtech.com.np" className="hover:text-brand-teal transition-colors">info@leafclutchtech.com.np</a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={18} className="text-brand-teal" />
                    <a href="tel:+9779766715768" className="hover:text-brand-teal transition-colors">+977-9766715768</a>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin size={18} className="text-brand-teal mt-1" />
                    <span>Siddharthanagar, Rupandehi, Nepal</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
