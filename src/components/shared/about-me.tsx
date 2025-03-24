"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

const skills = [
  {
    category: "frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Web Components"],
  },
  {
    category: "backend",
    items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
  },
  {
    category: "ai",
    items: ["ChatGPT", "AI Chatbots", "Machine Learning", "NLP"],
  },
  {
    category: "tools",
    items: ["Git", "Docker", "AWS", "CI/CD", "Agile"],
  },
] as const;

const companies = ["hayweb", "parsonline", "selfit"] as const;

export default function AboutMe() {
  const t = useTranslation();

  if (!t) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full h-full p-6 flex flex-col gap-6 overflow-y-auto"
    >
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {t.name}
        </h1>
        <h2 className="text-2xl text-gray-800 dark:text-white">{t.role}</h2>
        <p className="text-gray-700 dark:text-gray-100">{t.description}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.skills.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skillGroup) => (
            <motion.div
              key={skillGroup.category}
              variants={itemVariants}
              className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl p-4 space-y-2 border border-gray-200/20 dark:border-gray-700/30"
            >
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {t.skills[skillGroup.category]}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-500/20 dark:bg-blue-400/30 text-blue-700 dark:text-blue-100 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.experience.title}
        </h3>
        <div className="flex flex-wrap gap-4">
          {companies.map((company) => (
            <motion.div
              key={company}
              variants={itemVariants}
              className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl px-6 py-3 border border-gray-200/20 dark:border-gray-700/30"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {t.experience.companies[company]}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t.interests.title}
        </h3>
        <div className="flex flex-wrap gap-4">
          {["team", "leadership", "challenges", "git"].map((interest) => (
            <motion.div
              key={interest}
              variants={itemVariants}
              className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl px-6 py-3 border border-gray-200/20 dark:border-gray-700/30"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {t.interests[interest]}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
