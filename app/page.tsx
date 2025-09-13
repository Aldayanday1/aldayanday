"use client";

import { useState, useEffect } from "react";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { motion } from "motion/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';  // Tambahkan import ini
import SplashCursor from '@/components/SplashCursor';
import { TextAnimate } from "@/components/magicui/text-animate";
import GradualBlur from '@/components/GradualBlur';
import LightRays from '@/components/LightRays';
import tabsStyles from "@/components/tabs.module.css";

import pageStyles from '@/components/page.module.css'
import Project from '@/components/project';
import Modal from '@/components/modal';

export default function Home() {
  const [activeTab, setActiveTab] = useState("Project");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modal, setModal] = useState({ active: false, index: 0 })

  // add: desktop detection to only mount SplashCursor on desktop
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 640); // md breakpoint
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: "About me", label: "About me" },
    { id: "Stack", label: "Stack" },
    { id: "Project", label: "Project" },
    { id: "Credentials", label: "Credentials" },
    { id: "Contact", label: "Contact" }
  ];

  const getContentByTab = () => {
    switch (activeTab) {
      case "About me": return renderAboutMe();
      case "Stack": return renderStack();
      case "Project": return renderProject();
      case "Credentials": return renderCredentials();
      case "Contact": return renderContact();
      default: return renderAboutMe();
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
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce application built with Laravel backend and React frontend. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.",
      logo: "🛒",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop", // E-commerce related image from Unsplash
      buttonText: "View Project",
      link: "https://github.com/your-username/ecommerce-project"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Modern task management application built with Next.js and TypeScript. Includes real-time collaboration, drag & drop functionality, team management, and progress tracking.",
      logo: "📋",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop", // Task management related image from Unsplash
      buttonText: "View Demo",
      link: "https://github.com/your-username/task-app"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Responsive weather dashboard using React and external APIs. Features location-based weather data, 7-day forecasts, interactive maps, and customizable weather alerts.",
      logo: "🌤️",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop", // Weather related image from Unsplash
      buttonText: "Live Demo",
      link: "https://github.com/your-username/weather-dashboard"
    },
    {
      id: 4,
      title: "Social Media API",
      description: "RESTful API built with Node.js and Express for social media platform. Includes user authentication, post management, real-time messaging, and comprehensive documentation.",
      logo: "🔗",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop", // Social media related image from Unsplash
      buttonText: "Documentation",
      link: "https://github.com/your-username/social-api"
    }
  ];

  const renderProject = () => (
    <>
      {projects.map((item, index) => (
        <article
          key={index}
          className="w-full max-w-2xl mx-auto bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 mb-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-4 mr-5">
                <div className="w-12 h-12 rounded-lg bg-[var(--icon-background)] flex items-center justify-center text-lg shadow-sm shrink-0">
                  {item.logo}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[var(--button-border)] bg-[var(--button-background)] hover:bg-[var(--button-hover)] transition mx-auto text-[var(--text-primary)]"
                  aria-label={item.buttonText}
                >
                  {item.buttonText} →
                </button>
              </div>
            </div>
            <div className="w-full">
              {item.image ? (
                <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-inner">
                  <img
                    src={item.image}
                    alt={`${item.title} preview`}
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center h-48 sm:h-56">
                  <span className="text-sm text-[var(--text-secondary)]">Preview not available</span>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </>
  );

  // 4. Credentials - Keep existing (with project list)

  // data-certificate
  const certificate = [
    { title: "Internship at Diskominfosan", src: "certif_magang_kominfo.jpg", color: "#d1d1d1ff" }, // Abu gelap
    { title: "HTML & CSS Certiport", src: "certif_certiport_html_css.jpg", color: "#A0A0A0" }, // Abu sedang gelap
    { title: "Software Deployment TLab", src: "certif_deploy_docker.jpg", color: "#6B6B6B" }, // Abu sedang terang
    { title: "Cisco Network & Cybersecurity", src: "certif_cyber.jpg", color: "#4A4A4A" }, // Abu terang
  ]

  const renderCredentials = () => (
    <main className={pageStyles.main}>
      <div className={pageStyles.body}>
        {certificate.map((certificate, index) => (
          <Project index={index} title={certificate.title} setModal={setModal} key={index} />
        ))}
      </div>
      <Modal modal={modal} certificate={certificate} />
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
          ))}
        </div>
        <div className="text-center mt-8 p-6 bg-[var(--card-background)] border border-[var(--card-border)] rounded-xl">
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            I&apos;m always open to discussing new opportunities, collaborations, or just having a friendly chat about technology and development.
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* LightRays Background - Only in Dark Mode */}
      {isDarkMode && (
        <div className="fixed inset-0 -z-10">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
      )}

      {/* SplashCursor: only render on desktop to avoid mobile cost */}
      {isDesktop && <SplashCursor />}

      {/* Theme toggler */}
      <div className="fixed top-4 right-4 z-50">
        <AnimatedThemeToggler />
      </div>

      {/* Hero Section */}
      <div className="flex items-center justify-center w-full px-3 text-center" style={{ minHeight: "65vh" }}>
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 max-w-2xl">
          {/* Profile Image with Status */}
          <div className="relative py-4 sm:py-6">
            {/* Status Badge with Animation */}
            <motion.div
              className="absolute -top-10 sm:-top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs px-2 sm:px-3 py-1 rounded-full border"
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
                className="w-2 h-2 rounded-full bg-purple-500"
                animate={{
                  opacity: [1, 0, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(139, 92, 246, 0.7)",
                    "0 0 0 10px rgba(139, 92, 246, 0)",
                    "0 0 0 0 rgba(139, 92, 246, 0.7)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <span className='text-xs'>Active</span>
            </motion.div>

            {/* Profile Image with Animation */}
            <motion.div
              className="w-20 h-20 sm:w-27 sm:h-27 rounded-full overflow-hidden bg-transparent shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <img
                src="images/profile.png"
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
              className="text-lg sm:text-xl font-bold text-[var(--text-primary)]"
            >
              Mochamad Aldi Raihan Fachrizal
            </TextAnimate>
            <TextAnimate
              animation="blurIn"
              by="character"
              delay={0.3}
              once={true}  // Tambahkan ini
              className="text-base sm:text-lg font-bold text-[var(--text-secondary)]"
            >
              Fullstack Developer
            </TextAnimate>
            <TextAnimate
              animation="blurIn"
              by="character"
              delay={0.4}
              once={true}  // Tambahkan ini
              className="text-sm text-[var(--text-secondary)]"
            >
              I spend most of time thinking about Tea.
            </TextAnimate>
            <div className="text-xs text-[var(--text-secondary)] flex items-center justify-center gap-1">
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
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
            className="flex items-center gap-1 sm:gap-1 mt-4 sm:mt-1.5 text-base text-[var(--icon-color)]"
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
        className="w-full max-w-7xl mx-auto px-2 pb-6 mt-[-4rem]"
        initial={{ opacity: 0, y: 2, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5, stiffness: 100 }}
      >
        <div className={tabsStyles.tabs}>
          {tabs.map((tab) => (
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
          ))}
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
