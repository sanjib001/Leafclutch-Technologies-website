import React, { useState, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  memberApi,
  type MemberResponse,
} from "../../../services/memberService";
import InternsSkeleton from "./InternSkeleton";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const InternshipDetails: React.FC = () => {
  const [interns, setInterns] = useState<MemberResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        setLoading(true);
        const data = await memberApi.getInterns();

        const internList = Array.isArray(data)
          ? [...data].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime(),
            )
          : [];
        setInterns(internList.filter((m) => m.is_visible));
      } catch (err) {
        console.error("Failed to load interns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  return (
    <section className="py-20 px-8 bg-background">
      <motion.div
        className="container-padding mx-auto max-w-7xl"
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={fadeIn}>
          <h1 className="text-4xl font-bold text-primary dark:text-dark md:text-5xl mb-4">
            Our Intern Team
          </h1>
          <p className="text-muted-foreground text-lg">
            The talented individuals shaping the future of Leafclutch.
          </p>
        </motion.div>

        {/* Skeleton while loading */}
        {loading ? (
          <InternsSkeleton />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {interns.map((intern) => {
              const linkedinUrl =
                intern.social_media?.linkedin ||
                intern.social_media?.LinkedIn ||
                null;

              const displayPhoto =
                intern.photo_url && intern.photo_url !== "string"
                  ? intern.photo_url
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      intern.name,
                    )}&background=random&color=fff&size=200`;

              return (
                <motion.div
                  key={intern.id}
                  whileHover={{ y: -8 }}
                  className="flex flex-col items-center p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-accent/50 transition-all"
                  variants={fadeIn}
                >
                  <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-xl border-2 border-accent/10 bg-muted">
                    <img
                      src={displayPhoto}
                      alt={intern.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            intern.name,
                          )}&background=0D8ABC&color=fff`;
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-1">
                      {intern.name}
                    </h3>
                    <p className="text-accent font-medium text-sm mb-2">
                      {intern.position}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                      Internship Program
                    </p>
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0077B5] hover:opacity-80 transition-opacity"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default InternshipDetails;
