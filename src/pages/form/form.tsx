import React, {  useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Phone,  
  CheckCircle2, 
  AlertCircle,
  Send
} from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import {  PROGRAMS, REASONS, CONTACTS } from './types';
import type {FormData } from './types';

const INITIAL_DATA: FormData = {
  fullName: '',
  whatsappNumber: '',
  program: '',
  reason: '',
  otherReason: '',
  semester: '',
  email: '',
  linkedin: '',
  github: '',
};

export default function Form() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState("idle");

 const [waUrl, setWaUrl] = useState("");
const [mailtoUrl, setMailtoUrl] = useState("");
  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
   if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (formData.whatsappNumber.length !== 10) {
      newErrors.whatsappNumber = 'WhatsApp number must be 10 digits';
    }
    if (!formData.program) newErrors.program = 'Please select a program';
    if (!formData.reason && !formData.otherReason.trim()) {
      newErrors.reason = 'Please select a reason';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
     
      
      const message = `Hi Leafclutch Team,
      
I'm ${formData.fullName} and I'd like to enroll in the ${formData.program} internship.
My details:
- WhatsApp: ${formData.whatsappNumber}
- Email: ${formData.email}
- Semester: ${formData.semester || 'N/A'}
- Reason: ${formData.reason || formData.otherReason}
- LinkedIn: ${formData.linkedin || 'N/A'}
- GitHub: ${formData.github || 'N/A'}

Looking forward to hearing from you!`;

   const whatsappMessage = `New Training/Internship Form Submitted!

Name: ${formData.fullName}
Program: ${formData.program}
WhatsApp: ${formData.whatsappNumber}
Email: ${formData.email}

Check the email for full details.`

 setWaUrl(`https://wa.me/${CONTACTS[2].phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`);
    setMailtoUrl(`mailto:hr@leafclutchtech.com.np?subject=Internship Enrollment: ${formData.program}&body=${encodeURIComponent(message)}`);

        setIsSubmitted(true);

    //   window.open(waUrl, '_blank');
    //   window.open(mailtoUrl, '_blank');
    //   window.location.href = mailtoUrl;
    handleClear();
    window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClear = () => {
    setFormData(INITIAL_DATA);
    setErrors({});
  };

 

  if (isSubmitted) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 dot-grid">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full glass-card text-center"
      >
        {/* Header */}
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
          {step === 'done'
            ? <CheckCircle2 className="w-12 h-12 text-success" />
            : <Send className="w-12 h-12 text-primary" />
          }
        </div>

        <h2 className="text-3xl font-bold mb-4">
          {step === 'done' ? 'Application Sent!' : 'Send Your Application'}
        </h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          {step === 'done'
            ? <>We've received your interest in the <span className="text-primary font-bold">{formData.program}</span> program. Our team will reach out to you shortly.</>
            : <>Complete both steps below to submit your <span className="text-primary font-bold">{formData.program}</span> application.</>
          }
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-4 mb-8">

          {/* Step 1 - Email */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
            step === 'idle'
              ? 'border-primary/40 bg-primary/5'
              : 'border-success/40 bg-success/5'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all ${
              step !== 'idle' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
            }`}>
              {step !== 'idle' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Send via Email</p>
              <p className="text-xs text-muted-foreground">Opens your mail client</p>
            </div>
            {step === 'idle' ? (
              <a href={mailtoUrl} target="_blank" rel="noreferrer">
                <button
                  onClick={() => setStep('email')}
                  className="btn-primary-modern text-xs px-4 py-2"
                >
                  📧 Open
                </button>
              </a>
            ) : (
              <span className="text-xs text-success font-medium">Done ✓</span>
            )}
          </div>

          {/* Step 2 - WhatsApp */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
            step === 'done'
              ? 'border-success/40 bg-success/5'
              : step === 'email'
              ? 'border-primary/40 bg-primary/5'
              : 'border-border/30 bg-muted/30 opacity-50'
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all ${
              step === 'done' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
            }`}>
              {step === 'done' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">Notify via WhatsApp</p>
              <p className="text-xs text-muted-foreground">Sends a quick ping to our team</p>
            </div>
            {step === 'email' ? (
              <a href={waUrl} target="_blank" rel="noreferrer">
                <button
                  onClick={() => setStep('done')}
                  className="btn-primary-modern text-xs px-4 py-2"
                >
                  💬 Open
                </button>
              </a>
            ) : step === 'done' ? (
              <span className="text-xs text-success font-medium">Done ✓</span>
            ) : (
              <span className="text-xs text-muted-foreground">🔒 After step 1</span>
            )}
          </div>
        </div>

        {/* Bottom action */}
        {step === 'done' ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => { setIsSubmitted(false); setStep('idle'); }}
              className="btn-primary-modern w-full"
            >
              Back to form
            </button>
          </motion.div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {step === 'idle' ? 'Start with Step 1 to continue →' : 'Almost there! Complete Step 2 →'}
          </p>
        )}

      </motion.div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background dot-grid selection:bg-primary/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-12 border-b border-border bg-white/50 backdrop-blur-sm">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/10">
              Enrollment Open • {new Date().getFullYear()}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-8 leading-tight">
              Leafclutch Training & <br />
              <span className="text-primary">Internship Program</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              Join our 3-month remote program to gain practical experience in cutting-edge technologies. 
              We have attached a PDF containing details about our courses and fees.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a 
                href="https://drive.google.com/file/d/1w0XuiLAN7rvrGbOlmMabR7bMVcHeHQvA/view?usp=sharing" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-modern flex items-center gap-2"
              >
                <Download className="w-5 h-5" /> Download Details (PDF)
              </a>
            </div>

              <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                If you need any assistance, feel free to contact our team via WhatsApp or call:
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CONTACTS.map((contact, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="glass-card !p-5 text-left hover:shadow-2xl hover:shadow-primary/10 transition-all group"
                >
                  <div className="mb-4">
                   { contact.isRecommended && <p className="absolute top-[0.6rem] text-[0.6rem] font-bold text-accent uppercase tracking-widest mb-1 ">Recommended</p>}
                    <h4 className="text-xl font-bold text-foreground">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground ">{contact.phone}</p>
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-secondary text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
                    >
                      <Phone className="w-4 h-4" /> 
                    </a>
                    <a 
                      href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-secondary text-success text-xs font-bold hover:bg-success hover:text-white transition-all"
                    >
                      <FaWhatsapp className="w-6 h-6" /> 
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      
      <div className=" max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:items-start">
          {/* Left Side: Info */}
          <div className="lg:col-span-4 lg:sticky lg:top-[8rem]">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className=""
            >
              <h3 className="text-2xl font-bold mb-6">Program Overview</h3>
              <ul className="space-y-6">
                {[
                  { icon: CheckCircle2, title: "3-Month Duration", desc: "Intensive remote internship program." },
                  { icon: CheckCircle2, title: "Practical Learning", desc: "Work on real-world projects and tasks." },
                  { icon: CheckCircle2, title: "Expert Mentorship", desc: "Get guided by industry professionals." },
                  { icon: CheckCircle2, title: "Certification", desc: "Receive a certificate upon completion." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-12 p-6 rounded-2xl bg-primary text-primary-foreground ">
                <p className="text-sm font-medium opacity-80 mb-2">Next Step</p>
                <p className="font-bold leading-snug">
                  After submission, our team will contact you regarding payment and other details.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card"
              >
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="label-modern">Full Name <span className="text-destructive">*</span></label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="input-modern"
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                      />
                      {errors.fullName && <p className="text-xs text-destructive font-medium">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="label-modern">WhatsApp Number <span className="text-destructive">*</span></label>
                      <input 
                        type="tel" 
                        placeholder="98XXXXXXXX"
                        className="input-modern"
                        value={formData.whatsappNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({...formData, whatsappNumber: val});
                        }}
                      />
                      {errors.whatsappNumber && <p className="text-xs text-destructive font-medium">{errors.whatsappNumber}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="label-modern">Professional Email <span className="text-destructive">*</span></label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="input-modern"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
                  </div>

                  <div className="space-y-4">
                    <label className="label-modern">Select Program <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {PROGRAMS.map(program => (
                        <label 
                          key={program} 
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                            formData.program === program 
                              ? 'bg-primary/5 border-primary shadow-sm' 
                              : 'bg-white border-border hover:border-primary/30'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="program"
                            className="sr-only"
                            checked={formData.program === program}
                            onChange={() => setFormData({...formData, program})}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            formData.program === program ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
                          }`}>
                            {formData.program === program && <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm" />}
                          </div>
                          <span className="text-sm font-medium">{program}</span>
                        </label>
                      ))}
                    </div>
                    {errors.program && <p className="text-xs text-destructive font-medium">{errors.program}</p>}
                  </div>

                  <div className="space-y-4">
                    <label className="label-modern">Why join us? <span className="text-destructive">*</span></label>
                    <div className="space-y-3">
                      {REASONS.map(reason => (
                        <label 
                          key={reason} 
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                            formData.reason === reason 
                              ? 'bg-primary/5 border-primary shadow-sm' 
                              : 'bg-white border-border hover:border-primary/30'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="reason"
                            className="sr-only"
                            checked={formData.reason === reason}
                            onChange={() => setFormData({...formData, reason, otherReason: ''})}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            formData.reason === reason ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
                          }`}>
                            {formData.reason === reason && <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm" />}
                          </div>
                          <span className="text-sm font-medium">{reason}</span>
                        </label>
                      ))}
                      <div className="space-y-3">
                        <label className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          !!formData.otherReason && !formData.reason
                            ? 'bg-primary/5 border-primary shadow-sm' 
                            : 'bg-white border-border hover:border-primary/30'
                        }`}>
                          <input 
                            type="radio" 
                            name="reason"
                            className="sr-only"
                            checked={!!formData.otherReason && !formData.reason}
                            onChange={() => setFormData({...formData, reason: ''})}
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            !!formData.otherReason && !formData.reason ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
                          }`}>
                            {!!formData.otherReason && !formData.reason && <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-sm" />}
                          </div>
                          <span className="text-sm font-medium">Other</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Please specify..."
                          className="input-modern"
                          value={formData.otherReason}
                          onChange={e => setFormData({...formData, otherReason: e.target.value, reason: ''})}
                        />
                      </div>
                    </div>
                    {errors.reason && <p className="text-xs text-destructive font-medium">{errors.reason}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="label-modern">Semester</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 5th"
                        className="input-modern"
                        value={formData.semester}
                        onChange={e => setFormData({...formData, semester: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="label-modern">LinkedIn</label>
                      <input 
                        type="url" 
                        placeholder="https://..."
                        className="input-modern"
                        value={formData.linkedin}
                        onChange={e => setFormData({...formData, linkedin: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="label-modern">GitHub</label>
                      <input 
                        type="url" 
                        placeholder="https://..."
                        className="input-modern"
                        value={formData.github}
                        onChange={e => setFormData({...formData, github: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium uppercase tracking-widest mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Review your details before submitting
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button 
                      type="button"
                      onClick={handleClear}
                      className="btn-secondary-modern w-full sm:w-auto whitespace-nowrap"
                    >
                  Clear 
                    </button>
                    <button 
                      type="submit"
                      className="btn-primary-modern flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
                    >
                      Submit Application <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
      
    </div>
  );
}
