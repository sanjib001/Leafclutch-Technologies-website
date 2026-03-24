import { motion } from "framer-motion";
import {  Mail, Phone, MapPin } from "lucide-react";

export default function TermsOfService() {
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
            <FileText className="text-brand-teal" size={24} />
            <span className="font-bold text-lg tracking-tight">Legal Center</span>
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
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Terms of Service</h1>
            <p className="text-slate-500 font-medium italic">Last updated: March 9, 2026</p>
          </header>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <p className="mb-6">
                Welcome to Leafclutch Technologies Pvt. Ltd. (“we,” “us,” or “our”). By accessing or using our website <a href="https://leafclutchtech.com.np" className="font-semibold text-brand-teal" target="_blank" rel="noopener noreferrer">leafclutchtech.com.np</a> and enrolling in our training and internship programs, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                Services
              </h2>
              <div className="ml-11">
                <p className="mb-4">Leafclutch Technologies provides IT training, internship programs, and software development services. Our training programs include but are not limited to:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>AI & Machine Learning</li>
                  <li>Full Stack Web Development</li>
                  <li>Cybersecurity Fundamentals</li>
                  <li>UI/UX Design Mastery</li>
                  <li>Graphic Designing Professional</li>
                  <li>Data Science & Analytics</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                Eligibility
              </h2>
              <div className="ml-11">
                <p>
                  Our programs are open to individuals aged 16 and above. By enrolling, you confirm that you meet the minimum age requirement and that the information you provide is accurate and complete.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                Enrollment & Payment
              </h2>
              <div className="ml-11 space-y-4">
                <p>Enrollment is confirmed only after the application has been reviewed and accepted by our team.</p>
                <p>Program fees are as listed on our website at the time of enrollment. Prices are subject to change without prior notice for future batches.</p>
                <p>Payment must be made in full before the program begins, unless an installment plan has been agreed upon in writing.</p>
                <p>All fees are in Nepali Rupees (NPR) unless stated otherwise.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                Refund Policy
              </h2>
              <div className="ml-11 space-y-4">
                <p><span className="font-bold text-brand-dark">Before program start:</span> A full refund will be provided if cancellation is requested at least 7 days before the program start date.</p>
                <p><span className="font-bold text-brand-dark">Within first week:</span> A 50% refund may be provided if requested within the first 7 days of the program.</p>
                <p><span className="font-bold text-brand-dark">After first week:</span> No refunds will be issued after the first week of the program.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">5</span>
                Student Responsibilities
              </h2>
              <div className="ml-11">
                <p className="mb-3">As a participant in our programs, you agree to:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Attend sessions regularly and complete assigned tasks on time</li>
                  <li>Treat instructors, mentors, and fellow participants with respect</li>
                  <li>Not share, redistribute, or sell course materials without written permission</li>
                  <li>Not engage in plagiarism, cheating, or academic dishonesty</li>
                  <li>Follow all rules and guidelines communicated by program coordinators</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">6</span>
                Certificates
              </h2>
              <div className="ml-11 space-y-4">
                <p>Certificates of completion are awarded upon successful completion of the program, subject to:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Minimum attendance requirement (80%)</li>
                  <li>Completion of all required assignments and projects</li>
                  <li>Passing any assessments or evaluations as applicable</li>
                </ul>
                <p>Certificates are issued by Leafclutch Technologies Pvt. Ltd. and are not equivalent to formal academic degrees or diplomas.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">7</span>
                Intellectual Property
              </h2>
              <div className="ml-11">
                <p>
                  All content on our website, including text, graphics, logos, images, course materials, and software, is the property of Leafclutch Technologies Pvt. Ltd. and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from our content without express written permission.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">8</span>
                Website Use
              </h2>
              <div className="ml-11">
                <p className="mb-3">When using our website, you agree not to:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Use the website for any unlawful or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to any part of the website or its systems</li>
                  <li>Upload or transmit any malicious code, viruses, or harmful content</li>
                  <li>Interfere with or disrupt the website's functionality</li>
                  <li>Scrape, crawl, or collect data from the website without permission</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">9</span>
                Limitation of Liability
              </h2>
              <div className="ml-11">
                <p>
                  To the maximum extent permitted by law, Leafclutch Technologies Pvt. Ltd. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or participation in our programs. Our total liability shall not exceed the amount you paid for the specific program or service in question.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">10</span>
                Disclaimer
              </h2>
              <div className="ml-11">
                <p>
                  Our training programs are designed to provide practical skills and knowledge. However, we do not guarantee employment, internship placement, or specific career outcomes upon completion of any program. Career success depends on individual effort, market conditions, and other factors beyond our control.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">11</span>
                Termination
              </h2>
              <div className="ml-11">
                <p>
                  We reserve the right to terminate or suspend your access to our programs or website at any time, without prior notice, if you violate these Terms of Service or engage in conduct that is harmful to other participants, our instructors, or our organization.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">12</span>
                Governing Law
              </h2>
              <div className="ml-11">
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Rupandehi, Nepal.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-brand-dark mb-4 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">13</span>
                Changes to These Terms
              </h2>
              <div className="ml-11">
                <p>
                  We may update these Terms of Service from time to time. Any changes will be posted on this page with an updated “Last updated” date. Continued use of our services after changes constitutes acceptance of the revised terms.
                </p>
              </div>
            </section>

            <section className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
              <h2 className="text-2xl font-bold text-brand-dark mb-6 flex items-center gap-3">
                <span className="bg-brand-teal/10 text-brand-teal w-8 h-8 rounded-lg flex items-center justify-center text-sm">14</span>
                Contact Us
              </h2>
              <div className="ml-11 space-y-4">
                <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
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
