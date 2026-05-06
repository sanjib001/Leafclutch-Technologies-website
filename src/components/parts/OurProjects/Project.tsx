import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, UserCircle } from "lucide-react"; // Added UserCircle

import { CTA } from "./CTA";
import { Hero } from "./Hero";
import {
  projectApi,
  type ProjectResponse,
} from "../../../services/projectService";
import ProjectsSkeleton from "./ProjectsSkeleton";
import { supabase } from "../../../lib/supabase";
import { cacheInvalidate } from "../../../lib/cache";

const Projects = () => {
  const [dbProjects, setDbProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getAll();

        setDbProjects(data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('rt-public-projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        cacheInvalidate('projects:all');
        projectApi.getAll().then(data => setDbProjects(data));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <>
      <Hero />

      <section className="section-padding px-2 bg-background">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="space-y-12">
            {loading ? (
              <ProjectsSkeleton count={2} />
            ) : (
              dbProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="grid lg:grid-cols-5">
                    {/* Website Preview */}
                    <motion.a
                      href={project.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="group relative h-64 overflow-hidden lg:col-span-2 lg:h-auto"
                    >
                      <img
                        src={project.photo_url}
                        alt={project.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/600x400?text=Website+Preview";
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                      {/* <div className="absolute left-4 top-4 z-10 rounded-lg bg-card/90 px-4 py-2 backdrop-blur">
                      <span className="text-sm font-medium text-accent">
                        {project.techs[0] || "Innovation"}
                      </span>
                    </div> */}

                      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white">
                          Visit Website <ExternalLink className="h-4 w-4" />
                        </span>
                      </div>
                    </motion.a>

                    <div className="p-6 lg:col-span-3 lg:p-8">
                      <h3 className="mb-3 text-2xl font-bold">
                        {project.title}
                      </h3>

                      <p className="mb-4 text-muted-foreground">
                        {project.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold flex items-center gap-2 text-accent">
                          Client Feedback
                        </h4>
                        {project.feedbacks && project.feedbacks.length > 0 ? (
                          <div className="bg-muted/30 p-4 rounded-xl border border-border/50 italic text-sm text-muted-foreground">
                            "{project.feedbacks[0].feedback_description}"
                            <div className="mt-3 flex items-center gap-2 not-italic">
                              <UserCircle className="w-6 h-6 text-muted-foreground" />
                              <span className="font-bold text-xs text-primary">
                                {project.feedbacks[0].client_name}
                              </span>
                              <div className="flex ml-auto">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={10}
                                    className={
                                      i < project.feedbacks[0].rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            Project delivered with high client satisfaction.
                          </p>
                        )}
                      </div>

                      {/* Technologies */}
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techs.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground">
                        Business Impact
                      </p>
                      <p className="font-semibold text-accent">
                        Successfully Delivered & Operational
                      </p>
                    </div> */}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default Projects;
