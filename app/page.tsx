"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faLocationDot, faArrowRight } from '@fortawesome/free-solid-svg-icons';  // Tambahkan import ini
import { TextAnimate } from "@/components/magicui/text-animate";
import GradualBlur from '@/components/GradualBlur';
import FullScreenModal from '@/components/FullScreenModal';
import Credential from '@/components/project';
import Modal from '@/components/modal';
import MagneticGSAP from "@/components/MagneticGSAP";
import LogoLoop from '@/components/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { CometCard } from "@/components/ui/comet-card"; // added import
import ExpandableCardDemo from "@/components/expandable-card-demo-standard"; // Import komponen expandable card
import Silk from '@/components/Silk';


// Tambahkan import yang benar untuk CSS module
import tabsStyles from "@/components/Tabs.module.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Project");
  const [isDarkMode, setIsDarkMode] = useState(false); // Will be set correctly in useEffect
  const [modal, setModal] = useState({ active: false, index: 0 })
  const [fullScreenModal, setFullScreenModal] = useState({ active: false, index: 0 })
  const [cursorActive, setCursorActive] = useState(false);
  const [expandCardIndex, setExpandCardIndex] = useState<number | null>(null);

  // debounce timeout ref to avoid flicker when moving between cards
  const hoverTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) {
        window.clearTimeout(hoverTimeout.current);
      }
    };
  }, []);

  const handleCardMouseEnter = () => {
    if (hoverTimeout.current) {
      window.clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setCursorActive(true);
  };

  const handleCardMouseLeave = () => {
    if (hoverTimeout.current) window.clearTimeout(hoverTimeout.current);
    // delay unmount so quick moves between cards don't unmount the cursor
    hoverTimeout.current = window.setTimeout(() => {
      setCursorActive(false);
      hoverTimeout.current = null;
    }, 250); // 250ms debounce — adjust as needed (200-400ms recommended)
  };

  const tabs = [
    { id: "About", label: "About" },
    { id: "Stack", label: "Stack" },
    { id: "Project", label: "Project" },
    { id: "Credentials", label: "Credentials" },
    { id: "Contact", label: "Contact" }
  ];

  const getContentByTab = () => {
    switch (activeTab) {
      case "About": return renderAboutMe();
      case "Stack": return renderStack();
      case "Project": return renderProject();
      case "Credentials": return renderCredentials();
      case "Contact": return renderContact();
      default: return renderAboutMe()
    }
  };

  // 1. About Me - Simple text information
  const renderAboutMe = () => (
    <div className="w-full max-w-2xl mx-auto bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl p-8 shadow-lg">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl mx-auto mb-6">
          👨‍💻
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">About Me</h2>
        <div className="space-y-3 text-left">
          <p className="text-[var(--text-primary)] leading-relaxed">
            <strong>Mochamad Aldi Raihan Fachrizal</strong>
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Fresh Graduate dari Program Studi Teknik Informatika, Universitas Muhammadiyah Yogyakarta Angkatan 2021 dengan IPK 3.6.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Spesialis dalam pengembangan aplikasi <strong>Fullstack Development</strong> dengan pengalaman dalam membangun aplikasi web modern menggunakan teknologi terkini.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Passionate dalam menciptakan solusi digital yang inovatif dan user-friendly. Selalu antusias untuk belajar teknologi baru dan menghadapi tantangan dalam dunia programming.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Memiliki kemampuan bekerja dalam tim, komunikasi yang baik, dan mindset problem-solving yang kuat.
          </p>
        </div>
      </div>
    </div>
  );

  // 2. Stack - Minimalist skill boxes
  const renderStack = () => {
    const skills = [
      { name: "Laravel", category: "Backend", color: "from-red-500 to-orange-500" },
      { name: "React", category: "Frontend", color: "from-blue-500 to-cyan-500" },
      { name: "Next.js", category: "Frontend", color: "from-gray-700 to-gray-900" },
      { name: "JavaScript", category: "Language", color: "from-yellow-400 to-yellow-600" },
      { name: "TypeScript", category: "Language", color: "from-blue-600 to-blue-800" },
      { name: "Flutter", category: "Mobile", color: "from-blue-400 to-blue-600" },
      { name: "Node.js", category: "Backend", color: "from-green-500 to-green-700" },
      { name: "MySQL", category: "Database", color: "from-blue-500 to-blue-700" },
      { name: "MongoDB", category: "Database", color: "from-green-600 to-green-800" },
      { name: "Tailwind CSS", category: "Styling", color: "from-teal-400 to-teal-600" },
      { name: "Git", category: "Tools", color: "from-orange-500 to-red-500" },
      { name: "Docker", category: "DevOps", color: "from-blue-400 to-blue-600" }
    ];

    return (
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Tech Stack</h2>
          <p className="text-[var(--text-secondary)]">Technologies and tools I work with</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-lg p-4 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${skill.color}`}></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-primary)]">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">{skill.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // 3. Project - Keep existing design

  // data projects
  const projects = [
    {
      id: 1,
      title: "Task Management App",
      description: "Task app built with Next.js and TypeScript. Features real-time collab, drag & drop, team management, and progress tracking.",
      logo: "📋",
      image: "/images/projects-4.png", // Task management related image from Unsplash
      buttonText: "View Details",
      link: "https://github.com/your-username/task-app"
    },
    {
      id: 2,
      title: "Weather Dashboard",
      description: "Responsive weather dashboard with React and APIs. Shows location-based data, 7-day forecasts, maps, and alerts.",
      logo: "🌤️",
      image: "/images/projects-1.png", // Weather related image from Unsplash
      buttonText: "Learn More",
      link: "https://github.com/your-username/weather-dashboard"
    },
    {
      id: 3,
      title: "Social Media API",
      description: "RESTful API for social media using Node.js and Express. Includes auth, posts, messaging, and docs.",
      logo: "🔗",
      image: "/images/projects-2.png", // Social media related image from Unsplash
      buttonText: "Read More",
      link: "https://github.com/your-username/social-api"
    }
  ];

  const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  ];

  // Tambahkan data detail untuk expandable card di project
  const projectDetails = [
    {
      description: "Task Management App",
      title: "Task Management App",
      src: "/images/projects-4.png",
      ctaText: "View Demo",
      ctaLink: "https://github.com/your-username/task-app",
      content: () => (
        <>
          <p>
            Task Management App is a comprehensive solution built with Next.js and TypeScript, designed to streamline team collaboration and productivity. It features real-time updates, allowing users to track tasks instantly across devices, with intuitive drag-and-drop functionality for easy task reorganization.
          </p>
          <p>
            The app includes advanced team management tools, progress tracking with visual dashboards, and integration with popular project management workflows. It supports user authentication, role-based access, and customizable notifications to keep teams aligned and efficient.
          </p>
        </>
      ),
    },
    {
      description: "Weather Dashboard",
      title: "Weather Dashboard",
      src: "/images/projects-1.png",
      ctaText: "Live Demo",
      ctaLink: "https://github.com/your-username/weather-dashboard",
      content: () => (
        <>
          <p>
            Weather Dashboard is a responsive web application developed with React and integrated APIs, providing accurate and location-based weather data. It displays current conditions, hourly forecasts, and a detailed 7-day outlook, ensuring users stay informed about weather changes.
          </p>
          <p>
            The dashboard includes interactive maps for regional views, severe weather alerts, and customizable settings for preferred units and locations. Built with a focus on user experience, it offers a clean interface with smooth animations and accessibility features for all users.
          </p>
        </>
      ),
    },
    {
      description: "Social Media API",
      title: "Social Media API",
      src: "/images/projects-2.png",
      ctaText: "See Live",
      ctaLink: "https://github.com/your-username/social-api",
      content: () => (
        <>
          <p>
            Social Media API is a robust RESTful backend service created using Node.js and Express, tailored for modern social media platforms. It handles user authentication securely, manages posts, comments, and likes, while supporting real-time messaging through WebSocket integration.
          </p>
          <p>
            The API includes comprehensive documentation with Swagger, rate limiting for performance, and data validation to ensure reliability. It supports scalable database operations with MongoDB, making it ideal for high-traffic applications requiring efficient data handling and user privacy controls.
          </p>
        </>
      ),
    },
  ];

  // Revisi renderProject agar action button langsung buka detail card
  const renderProject = () => (
    <div className="w-full max-w-2xl mx-auto space-y-15">
      {/* Nonaktifkan SmoothCursor di mobile (< 640px) */}
      {cursorActive && isDesktop && <SmoothCursor />}

      {projects.map((item, index) => (
        <div key={item.id ?? index} className="relative">
          {/* Nonaktifkan CometCard di mobile (< 640px) */}
          {isDesktop ? (
            <CometCard
              rotateDepth={17.5}
              translateDepth={20}
              className="-mb-6"
            >
              <motion.article
                className="w-full bg-[var(--card-background)] rounded-[10px] overflow-hidden transition-all duration-300 relative project-card py-[6px]"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  boxShadow: isDarkMode
                    ? "0 8px 24px rgba(2,6,23,0.12)"
                    : "0 6px 18px rgba(15,23,42,0.04)",
                  border: "1px solid rgba(0,0,0,0.04)"
                }}
              >
                {/* Mobile Layout - Stack vertically */}
                <div className="block sm:hidden">
                  {/* Content Section */}
                  <div className="px-6 py-4">
                    <div className="mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--icon-background)] flex items-center justify-center text-[22px] shadow-sm mb-4">
                        {item.logo}
                      </div>
                      <h3 className="font-semibold text-[18px] text-[var(--text-primary)] text-left mb-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="mb-4">
                      <p className="text-[13px] font-semibold text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Image Section - Simple layout for mobile */}
                    {item.image && (
                      <div className="mb-4">
                        <div className="w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                          <img
                            src={item.image}
                            alt={`${item.title} preview`}
                            className="w-full h-[180px] object-cover"
                            style={{
                              objectPosition: index === 0 ? 'left center' :
                                index === 1 ? 'left center' :
                                  index === 2 ? 'center center' :
                                    'center center',
                              filter: 'contrast(1.02) saturate(1.03)'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons and Tech Stack */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={item.buttonText}
                          className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-[12px] font-medium 
                            bg-[var(--background)] text-[var(--text-primary)] 
                            border border-[var(--text-primary)] shadow-sm 
                            ${isDarkMode
                              ? 'hover:bg-white hover:text-black hover:border-black'
                              : 'hover:bg-[var(--text-primary)] hover:text-[var(--background)] hover:border-[var(--background)]'
                            } 
                            transition-colors duration-150 group`}
                          onClick={() => setExpandCardIndex(index)}
                        >
                          <span className="leading-none text-[10px] font-semibold">{item.buttonText}</span>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className={`text-[10px] leading-none transition-transform duration-150 group-hover:translate-x-1 ${isDarkMode ? 'text-gray-400 group-hover:text-black' : 'text-gray-400'
                              }`}
                          />
                        </button>

                        <a
                          href={item.link ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className={`w-8 h-8 flex items-center justify-center rounded-full border border-[var(--text-primary)] bg-[var(--background)] text-[var(--text-primary)] shadow-sm
                            ${isDarkMode
                              ? 'hover:bg-white hover:text-black hover:border-black'
                              : 'hover:bg-[var(--text-primary)] hover:text-[var(--background)] hover:border-[var(--background)]'
                            }
                            transition-colors duration-150 group`}
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-[16px]" />
                        </a>
                      </div>

                      <div style={{ height: '22px', width: '155px', position: 'relative', overflow: 'hidden' }}>
                        <LogoLoop
                          logos={techLogos}
                          speed={80}
                          direction="right"
                          logoHeight={18}
                          gap={8}
                          pauseOnHover
                          scaleOnHover
                          fadeOut
                          fadeOutColor="var(--card-background)"
                          ariaLabel="Technology partners"
                          className="text-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Existing layout with side image */}
                <div className="hidden sm:flex items-stretch">
                  <div className="flex-1 px-6 py-[6px] flex flex-col justify-between">
                    <div className="mb-2">
                      <div className="w-10 h-10 sm:w-[34px] sm:h-[34px] rounded-lg bg-[var(--icon-background)] flex items-center justify-center text-[22px] sm:text-[28px] shadow-sm mb-9">
                        {item.logo}
                      </div>
                      <h3 className="font-semibold text-[20px] sm:text-[20px] text-[var(--text-primary)] text-left mb-1">
                        {item.title}
                      </h3>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs sm:text-[13.5px] font-semibold text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={item.buttonText}
                          className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-[13px] sm:text-[16px] font-medium 
                            bg-[var(--background)] text-[var(--text-primary)] 
                            border border-[var(--text-primary)] shadow-sm 
                            ${isDarkMode
                              ? 'hover:bg-white hover:text-black hover:border-black'
                              : 'hover:bg-[var(--text-primary)] hover:text-[var(--background)] hover:border-[var(--background)]'
                            } 
                            transition-colors duration-150 group`}
                          onClick={() => setExpandCardIndex(index)}
                        >
                          <span className="leading-none text-[11px] sm:text-[12px] font-semibold">{item.buttonText}</span>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className={`text-[12px] sm:text-[10px] leading-none transition-transform duration-150 group-hover:translate-x-1 ${isDarkMode ? 'text-gray-400 group-hover:text-black' : 'text-gray-400'
                              }`}
                          />
                        </button>

                        <a
                          href={item.link ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex items-center justify-center rounded-full border border-[var(--text-primary)] bg-[var(--background)] text-[var(--text-primary)] shadow-sm
                            ${isDarkMode
                              ? 'hover:bg-white hover:text-black hover:border-black'
                              : 'hover:bg-[var(--text-primary)] hover:text-[var(--background)] hover:border-[var(--background)]'
                            }
                            transition-colors duration-150 group`}
                          style={{ fontSize: '1.1rem' }}
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-[18px] sm:text-[18px]" />
                        </a>
                      </div>

                      <div style={{ height: '22px', width: '123px', position: 'relative', overflow: 'hidden' }}>
                        <LogoLoop
                          logos={techLogos}
                          speed={80}
                          direction="right"
                          logoHeight={20}
                          gap={10}
                          pauseOnHover
                          scaleOnHover
                          fadeOut
                          fadeOutColor="var(--card-background)"
                          ariaLabel="Technology partners"
                          className="text-[16px] sm:text-[22px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop Image - Existing complex positioning */}
                  {item.image && (
                    <div className="w-1/2 flex items-end">
                      <div className="w-full p-4 pt-0 flex justify-end">
                        <div
                          className="rounded-[10px] overflow-hidden bg-gray-50 dark:bg-gray-800"
                          style={{
                            position: 'absolute',
                            right: '-2rem',
                            top: '60%',
                            width: '55%',
                            maxWidth: '820px',
                            height: '320px',
                            transform: 'translateY(-40%) translateX(-2%)',
                            transition: 'transform 280ms ease, box-shadow 220ms ease',
                            boxShadow: isDarkMode
                              ? '0 28px 60px rgba(2,6,23,0.55), 0 10px 30px rgba(0,0,0,0.25)'
                              : '0 20px 40px rgba(2,6,23,0.08), 0 6px 18px rgba(2,6,23,0.06)'
                          }}
                        >
                          <img
                            src={item.image}
                            alt={`${item.title} preview`}
                            className="block"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: index === 0 ? 'left center' :
                                index === 1 ? 'left center' :
                                  index === 2 ? 'center center' :
                                    'center center',
                              filter: 'contrast(1.02) saturate(1.03)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>
            </CometCard>
          ) : (
            <div className="-mb-10">
              <motion.article
                className="w-full bg-[var(--card-background)] rounded-[10px] overflow-hidden transition-all duration-300 relative project-card py-[6px]"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onMouseEnter={handleCardMouseEnter}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  boxShadow: isDarkMode
                    ? "0 8px 24px rgba(2,6,23,0.12)"
                    : "0 6px 18px rgba(15,23,42,0.04)",
                  border: "1px solid rgba(0,0,0,0.04)"
                }}
              >
                {/* Mobile Layout - Stack vertically */}
                <div className="block sm:hidden">
                  {/* Content Section */}
                  <div className="px-6 py-4">
                    <div className="mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--icon-background)] flex items-center justify-center text-[22px] shadow-sm mb-4">
                        {item.logo}
                      </div>
                      <h3 className="font-semibold text-[18px] text-[var(--text-primary)] text-left mb-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="mb-4">
                      <p className="text-[13px] font-semibold text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Image Section - Simple layout for mobile */}
                    {item.image && (
                      <div className="mb-4">
                        <div className="w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                          <img
                            src={item.image}
                            alt={`${item.title} preview`}
                            className="w-full h-[180px] object-cover"
                            style={{
                              objectPosition: index === 0 ? 'left center' :
                                index === 1 ? 'left center' :
                                  index === 2 ? 'center center' :
                                    'center center',
                              filter: 'contrast(1.02) saturate(1.03)'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons and Tech Stack */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={item.buttonText}
                          className={`inline-flex items-center gap-1 px-2 py-2 rounded-full
                            bg-[var(--background)] text-[var(--text-primary)] 
                            border border-[var(--text-primary)] shadow-sm 
                            ${isDarkMode
                              ? 'hover:bg-white hover:text-black hover:border-black'
                              : 'hover:bg-[var(--text-primary)] hover:text-[var(--background)] hover:border-[var(--background)]'
                            } 
                            transition-colors duration-150 group`}
                          onClick={() => setExpandCardIndex(index)}
                        >
                          <span className="leading-none text-[10px] font-semibold">{item.buttonText}</span>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className={`text-[10px] leading-none transition-transform duration-150 group-hover:translate-x-1 ${isDarkMode ? 'text-gray-400 group-hover:text-black' : 'text-gray-400'
                              }`}
                          />
                        </button>

                        <a
                          href={item.link ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className={`w-8 h-8 flex items-center justify-center rounded-full border border-[var(--text-primary)] bg-[var(--background)] text-[var(--text-primary)] shadow-sm
                            ${isDarkMode
                              ? 'hover:bg-white hover:text-black hover:border-black'
                              : 'hover:bg-[var(--text-primary)] hover:text-[var(--background)] hover:border-[var(--background)]'
                            }
                            transition-colors duration-150 group`}
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-[16px]" />
                        </a>
                      </div>

                      <div style={{ height: '22px', width: '125px', position: 'relative', overflow: 'hidden' }}>
                        <LogoLoop
                          logos={techLogos}
                          speed={80}
                          direction="right"
                          logoHeight={18}
                          gap={8}
                          pauseOnHover
                          scaleOnHover
                          fadeOut
                          fadeOutColor="var(--card-background)"
                          ariaLabel="Technology partners"
                          className="text-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout - Existing layout with side image */}
                <div className="hidden sm:flex items-stretch">
                  <div className="flex-1 px-6 py-[6px] flex flex-col justify-between">
                    <div className="mb-2">
                      <div className="w-10 h-10 sm:w-[34px] sm:h-[34px] rounded-lg bg-[var(--icon-background)] flex items-center justify-center text-[22px] sm:text-[28px] shadow-sm mb-9">
                        {item.logo}
                      </div>
                      <h3 className="font-semibold text-[20px] sm:text-[20px] text-[var(--text-primary)] text-left mb-1">
                        {item.title}
                      </h3>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs sm:text-[13.5px] font-semibold text-[var(--text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={item.buttonText}
                          className={`inline-flex items-center gap-1 px-2 py-2 rounded-full text-[13px] sm:text-[16px] font-medium 
                            bg-[var(--background)] text-[var(--text-primary)] 
                            border border-[var(--text-primary)] shadow-sm 
                            ${isDarkMode
                              ? 'hover:bg-white hover:text-black hover:border-black'
                              : 'hover:bg-[var(--text-primary)] hover:text-[var(--background)] hover:border-[var(--background)]'
                            } 
                            transition-colors duration-150 group`}
                          onClick={() => setExpandCardIndex(index)}
                        >
                          <span className="leading-none text-[11px] sm:text-[12px] font-semibold">{item.buttonText}</span>
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className={`text-[12px] sm:text-[10px] leading-none transition-transform duration-150 group-hover:translate-x-1 ${isDarkMode ? 'text-gray-400 group-hover:text-black' : 'text-gray-400'
                              }`}
                          />
                        </button>

                        <a
                          href={item.link ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                          className={`w-8 h-8 sm:w-[35px] sm:h-[35px] flex items-center justify-center rounded-full border border-[var(--text-primary)] bg-[var(--background)] text-[var(--text-primary)] shadow-sm
                            ${isDarkMode
                              ? 'hover:bg-white hover:text-black hover:border-black'
                              : 'hover:bg-[var(--text-primary)] hover:text-[var(--background)] hover:border-[var(--background)]'
                            }
                            transition-colors duration-150 group`}
                          style={{ fontSize: '1.1rem' }}
                        >
                          <FontAwesomeIcon icon={faGithub} className="text-[18px] sm:text-[18px]" />
                        </a>
                      </div>

                      <div style={{ height: '22px', width: '123px', position: 'relative', overflow: 'hidden' }}>
                        <LogoLoop
                          logos={techLogos}
                          speed={80}
                          direction="right"
                          logoHeight={20}
                          gap={10}
                          pauseOnHover
                          scaleOnHover
                          fadeOut
                          fadeOutColor="var(--card-background)"
                          ariaLabel="Technology partners"
                          className="text-[16px] sm:text-[22px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop Image - Existing complex positioning */}
                  {item.image && (
                    <div className="w-1/2 flex items-end">
                      <div className="w-full p-4 pt-0 flex justify-end">
                        <div
                          className="rounded-[10px] overflow-hidden bg-gray-50 dark:bg-gray-800"
                          style={{
                            position: 'absolute',
                            right: '-2rem',
                            top: '60%',
                            width: '55%',
                            maxWidth: '820px',
                            height: '320px',
                            transform: 'translateY(-40%) translateX(-2%)',
                            transition: 'transform 280ms ease, box-shadow 220ms ease',
                            boxShadow: isDarkMode
                              ? '0 28px 60px rgba(2,6,23,0.55), 0 10px 30px rgba(0,0,0,0.25)'
                              : '0 20px 40px rgba(2,6,23,0.08), 0 6px 18px rgba(2,6,23,0.06)'
                          }}
                        >
                          <img
                            src={item.image}
                            alt={`${item.title} preview`}
                            className="block"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: index === 0 ? 'left center' :
                                index === 1 ? 'left center' :
                                  index === 2 ? 'center center' :
                                    'center center',
                              filter: 'contrast(1.02) saturate(1.03)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.article>
            </div>
          )}

          <AnimatePresence>
            {expandCardIndex === index && (
              <motion.div
                key={`expand-modal-${index}`}
                className="absolute inset-0 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExpandableCardDemo
                  card={projectDetails[index]}
                  onHoverEnter={handleCardMouseEnter}
                  onHoverLeave={handleCardMouseLeave}
                  onClose={() => {
                    setExpandCardIndex(null);
                    setCursorActive(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );

  // 4. Credentials - Keep existing 

  // data-certificate
  const certificate = [
    { title: "Internship at Diskominfosan", src: "certif_magang_kominfo.jpg", color: "#d1d1d1ff" }, // Abu gelap
    { title: "HTML & CSS Certiport", src: "certif_certiport_html_css.jpg", color: "#A0A0A0" }, // Abu sedang gelap
    { title: "Software Deployment TLab", src: "certif_deploy_docker.jpg", color: "#6B6B6B" }, // Abu sedang terang
    { title: "Cisco Network & Cybersecurity", src: "certif_cyber.jpg", color: "#4A4A4A" }, // Abu terang
  ]

  const renderCredentials = () => (
    <main>
      <div>
        {certificate.map((certificate, index) => (
          <Credential
            index={index}
            title={certificate.title}
            setModal={setModal}
            setFullScreenModal={setFullScreenModal}
            key={index}
          />
        ))}
      </div>
      <Modal modal={modal} certificates={certificate} />
      <FullScreenModal
        modal={fullScreenModal}
        certificates={certificate}
        onClose={() => setFullScreenModal({ active: false, index: 0 })}
      />
    </main>
  );

  // 5. Contact - Horizontal icons with names
  const renderContact = () => {
    const contacts = [
      { name: "WhatsApp", icon: "📱", color: "from-green-500 to-green-600", link: "https://wa.me/your-number" },
      { name: "Gmail", icon: "📧", color: "from-red-500 to-red-600", link: "mailto:your-email@gmail.com" },
      { name: "LinkedIn", icon: "💼", color: "from-blue-600 to-blue-700", link: "https://linkedin.com/in/your-profile" },
      { name: "GitHub", icon: "🐙", color: "from-gray-700 to-gray-900", link: "https://github.com/your-username" },
      { name: "Instagram", icon: "📸", color: "from-pink-500 to-purple-600", link: "https://instagram.com/your-username" },
      { name: "Telegram", icon: "✈️", color: "from-blue-400 to-blue-500", link: "https://t.me/your-username" }
    ];

    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Get In Touch</h2>
          <p className="text-[var(--text-secondary)]">Let&apos;s connect and work together</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.name}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl p-4 hover:shadow-lg transition-all duration-300 group text-center"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${contact.color} flex items-center justify-center text-xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                {contact.icon}
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] text-sm group-hover:text-[var(--text-primary)]">
                {contact.name}
              </h3>
            </motion.a>
          ))
          }
        </div >
        <div className="text-center mt-8 p-6 bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl">
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            I&apos;m always open to discussing new opportunities, collaborations, or just having a friendly chat about technology and development.
          </p>
        </div>
      </div >
    );
  };

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Detect MagneticGSAP only for Desktop (min-width: 640px)
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <>
      {/* Silk background dengan class CSS yang stabil */}
      {isDarkMode && (
        <div className="silk-background" style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden'
        }}>
          <Silk
            speed={5}
            scale={1}
            color="#404040"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
      )}

      {/* Theme toggler */}
      <div className="fixed top-4 right-4 z-50">
        <AnimatedThemeToggler onToggle={setIsDarkMode} />
      </div>

      {/* Hero Section */}
      <div className="flex items-center justify-center w-full px-3 text-center sm:mt-0 mt-4" style={{ minHeight: "65vh" }}>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 max-w-2xl">
          {/* Profile Image with Status */}
          <div className="relative py-4 sm:py-6 -mt-16">
            {/* Status Badge with Animation */}
            <motion.div
              className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2 px-3 sm:px-3 py-1 rounded-full border"
              style={{
                backgroundColor: 'var(--status-badge-bg)',
                borderColor: 'var(--status-badge-border)',
                color: 'var(--status-badge-text)',
                backdropFilter: 'blur(10px)'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <motion.span
                className="w-[7px] h-[7px] sm:w-[10px] sm:h-[10px] rounded-full bg-purple-500"
                animate={{
                  opacity: [1, 0, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(139, 92, 246, 0.7)",
                    "0 0 0 6px rgba(139, 92, 246, 0)",
                    "0 0 0 0 rgba(139, 92, 246, 0.7)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className='text-[11px] sm:text-[14px]'>Active</span>
            </motion.div>

            {/* Profile Image with Animation */}
            <motion.div
              className="w-20 h-20 sm:w-27 sm:h-27 rounded-full overflow-hidden bg-transparent shadow-xl mt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <img
                src="images/profile-3.png"
                alt="Profile"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 10%' }}
              />
            </motion.div>
          </div>

          {/* Profile Text with Animation */}
          <div className="space-y-2">
            <TextAnimate
              animation="blurIn"
              by="character"
              delay={0.2}
              once={true}  // Tambahkan ini agar animasi hanya sekali
              className="text-[16px] sm:text-[20px] md:text-[24px] font-bold text-[var(--text-primary)]"
            >
              Mochamad Aldi Raihan Fachrizal
            </TextAnimate>
            <TextAnimate
              animation="blurIn"
              by="character"
              delay={0.3}
              once={true}  // Tambahkan ini
              className="text-[14px] sm:text-[16px] md:text-[18px] font-bold text-[var(--text-secondary)]"
            >
              Im a Fullstack Developer.

            </TextAnimate>
            <TextAnimate
              animation="blurIn"
              by="character"
              delay={0.4}
              once={true}  // Tambahkan ini
              className="text-[12.5px] sm:text-[14px] md:text-[16px] text-[var(--text-secondary)]"
            >
              I spend most of time thinking about Tea.
            </TextAnimate>
            <div className="text-[11.5px] sm:text-[12px] md:text-[14px] text-[var(--text-secondary)] flex items-center justify-center gap-1">
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <FontAwesomeIcon icon={faLocationDot} className="text-[12px] sm:text-[12px] md:text-[14px]" />
              </motion.div>
              <TextAnimate
                animation="blurIn"
                by="character"
                delay={0.5}
                once={true}
              >
                Yogyakarta, Indonesia
              </TextAnimate>
            </div>
          </div>

          {/* Social Icons with Animation */}
          <motion.div
            className="flex items-center gap-1 sm:gap-1 mt-4 sm:mt-1.5 text-[16px] sm:text-[16px] md:text-[18px] text-[var(--icon-color)]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  delayChildren: 0.5,
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {[
              { icon: <FontAwesomeIcon icon={faGithub} />, href: "#" },
              { icon: <FontAwesomeIcon icon={faYoutube} />, href: "#" },
              { icon: <FontAwesomeIcon icon={faLinkedin} />, href: "#" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className="p-1 sm:p-1.5 border-[var(--icon-color)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs and Content Section */}
      <motion.div
        className="w-full max-w-7xl mx-auto px-2 pb-6 sm:mt-[-10rem] mt-[-6rem]"
        initial={{ opacity: 0, y: 2, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5, stiffness: 100 }}
      >
        <div className={tabsStyles.tabs}>
          {tabs.map((tab) =>
            isDesktop ? (
              <MagneticGSAP
                key={tab.id}
                strength={0.5}
                range={200}
                duration={0.5}
              >
                <motion.button
                  onClick={() => setActiveTab(tab.id)}
                  data-active={activeTab === tab.id}
                  className={tabsStyles.tabBtn}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.8 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {tab.label}
                </motion.button>
              </MagneticGSAP>
            ) : (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-active={activeTab === tab.id}
                className={tabsStyles.tabBtn}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.8 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {tab.label}
              </motion.button>
            )
          )}
        </div>

        {/* Content Section */}
        <div className="px-4 md:px-6 mb-20 max-w-3xl mx-auto">
          {getContentByTab()}
        </div>
      </motion.div>

      {/* GradualBlur at the bottom of the page */}
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
      />
    </>
  );
}
