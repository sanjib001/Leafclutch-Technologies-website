import React, { useState, useEffect } from "react";
import { Linkedin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  memberApi,
  type MemberResponse,
} from "../../../services/memberService";
import TeamMembersSkeleton from "./TeamMemberSkeleton";

// Fade-in variants - Keeping your exact animations
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const AboutTeam: React.FC = () => {
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const data = await memberApi.getTeams();

        const teamList = Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
            )
          : [];
        // console.log(data);
        // Only show members marked as visible on the backend
        setMembers(teamList.filter((m) => m.is_visible));
      } catch (err) {
        console.error("Failed to load team members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="py-24 text-center font-bold animate-pulse text-primary uppercase tracking-widest">
  //       Loading Team...
  //     </div>
  //   );
  // }

  return (
    <section className="section-padding max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
      <motion.h2
        className="text-4xl font-heading font-bold text-primary"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        Our Team Members
      </motion.h2>
      {loading ? (
        <TeamMembersSkeleton
          count={6}
          staggerContainer={staggerContainer}
          fadeIn={fadeIn}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 lg:gap-x-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          variants={staggerContainer}
        >
          {members.map((member) => {
            // Extract LinkedIn from the social_media object dynamically
            const linkedinUrl =
              member.social_media?.linkedin ||
              member.social_media?.LinkedIn ||
              Object.values(member.social_media)[0];

            return (
              <motion.div
                key={member.id}
                className="space-y-4 text-center group"
                variants={fadeIn}
              >
                <div className="w-[90%] aspect-square mx-auto overflow-hidden rounded-3xl border-2 border-transparent group-hover:border-accent transition-all shadow-md bg-muted">
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 px-1">
                  <h4 className="font-bold text-[1.5rem] leading-tight text-primary dark:text-white">
                    {member.name}
                  </h4>
                  <p className="text-[0.9rem] text-muted-foreground uppercase tracking-[0.1em] font-bold">
                    {member.position}
                  </p>
                  <div className="pt-2">
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-accent text-[0.8rem] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                      >
                        <Linkedin className="w-3.5 h-3.5 mr-1.5" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

     <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  }}
  viewport={{ once: true, amount: 0.2 }}
  // className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-6 max-w-5xl mx-auto justify-center"
>
  {/* <Link to="/intern-details">
    <button className="w-full h-16 bg-primary text-white font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-base">
      <span>Our Intern Team</span>
      <ArrowRight className="w-5 h-5" />
    </button>
  </Link> */}
    <Link to="/intern-details">
          <button className="px-12 py-5 bg-primary text-white font-bold rounded-full hover:scale-105 transition-all flex items-center mx-auto space-x-3 uppercase tracking-[0.2em] text-base">
            <span>Our Intern Team</span>
            <ArrowRight className="w-5 h-5" />
          </button>
    </Link>

  {/* <Link to="/mentor-details">
    <button className="w-full h-16 bg-primary text-white font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-base">
      <span>Our Mentor Team</span>
      <ArrowRight className="w-5 h-5" />
    </button>
  </Link> */}

</motion.div>
    </section>
  );
};

export default AboutTeam;
