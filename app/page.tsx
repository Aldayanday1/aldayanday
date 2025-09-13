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
      case "About me": return aboutMe;
      case "Stack": return stack;
      case "Project": return project;
      case "Credentials": return credentials;
      case "Contact": return contact;
      default: return aboutMe;
    }
  };

  type TabItem = {
    id: number;
    title: string;
    description: string;
    logo: string;
    buttonText: string;
    featured: boolean;
    image?: string;
  };

  const aboutMe: TabItem[] = [
    {
      id: 1,
      title: "Web Development",
      description: "Full-stack web development using modern technologies like React, Next.js, and Node.js.",
      logo: "💻",
      buttonText: "Learn more",
      featured: false
    },
    {
      id: 2,
      title: "UI/UX Design",
      description: "Creating beautiful and intuitive user interfaces with modern design principles.",
      logo: "🎨",
      buttonText: "View portfolio",
      featured: false
    }
  ];

  const stack: TabItem[] = [
    {
      id: 1,
      title: "Frontend",
      description: "React, Next.js, TypeScript, Tailwind CSS, Framer Motion",
      logo: "⚛️",
      buttonText: "Explore",
      featured: false
    },
    {
      id: 2,
      title: "Backend",
      description: "Node.js, Express, MongoDB, PostgreSQL, Redis",
      logo: "🔧",
      buttonText: "Learn more",
      featured: false
    }
  ];

  const project: TabItem[] = [
    {
      id: 1,
      title: "FramerIt",
      description: "Create stunning Framer websites in minutes with our Clean & Responsive Templates.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop", // Gambar web development
      logo: "🔥",
      buttonText: "Visit site",
      featured: true
    },
    {
      id: 2,
      title: "Framer",
      description: "A true design canvas, not just a visual HTML editor. Framer is the website builder loved by designers worldwide.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", // Gambar design/UI
      logo: "⚡",
      buttonText: "Visit site",
      featured: false
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "A personal portfolio website showcasing creative projects, skills, and achievements with modern design and smooth animations.",
      image: "https://images.unsplash.com/photo-1545665277-5937489579f2?w=400&h=300&fit=crop", // Gambar portfolio/website
      logo: "🎨",
      buttonText: "View project",
      featured: false
    },
    {
      id: 4,
      title: "E-commerce Platform",
      description: "A modern e-commerce platform with advanced features like real-time inventory, payment integration, and analytics dashboard.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", // Gambar e-commerce
      logo: "🛒",
      buttonText: "Explore",
      featured: false
    }
  ];

  const credentials: TabItem[] = [
    {
      id: 1,
      title: "Tech Startup A",
      description: "Built a complete e-commerce platform with real-time analytics dashboard.",
      logo: "🚀",
      buttonText: "Case study",
      featured: false
    },
    {
      id: 2,
      title: "Agency B",
      description: "Developed multiple client websites with custom CMS integration.",
      logo: "🏢",
      buttonText: "View work",
      featured: false
    }
  ];

  const contact: TabItem[] = [
    {
      id: 1,
      title: "Let's Work Together",
      description: "Ready to bring your ideas to life? Let's discuss your next project.",
      logo: "🤝",
      buttonText: "Contact me",
      featured: false
    },
    {
      id: 2,
      title: "Follow My Journey",
      description: "Stay updated with my latest projects, tutorials, and insights.",
      logo: "📱",
      buttonText: "Follow me",
      featured: false
    }
  ];


  // projct-mouse-hover

  const projects = [
    { title: "Sertifikat HTML & CSS", src: "certif_certiport_html_css.jpg", color: "#ffffff" },
    { title: "Sertifikat Cybersecurity", src: "certif_cyber.jpg", color: "#8C8C8C" },
    { title: "Sertifikat Deploy Docker", src: "certif_deploy_docker.jpg", color: "#EFE8D3" },
    { title: "Sertifikat Magang Kominfo", src: "certif_magang_kominfo.jpg", color: "#706D63" }
  ]

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
        <div className="grid grid-cols-1 gap-6 px-4 md:px-6 mb-20 max-w-3xl mx-auto">
          {getContentByTab().map((item) => (
            <article
              key={item.id}
              className="w-full max-w-2xl mx-auto bg-[var(--card-background)] border border-[var(--card-border)] rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* card inner layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                {/* LEFT: icon + text */}
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

                  {/* action button */}
                  <div className="mt-6">
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[var(--button-border)] bg-[var(--button-background)] hover:bg-[var(--button-hover)] transition mx-auto text-[var(--text-primary)]"
                      aria-label={item.buttonText}
                    >
                      {item.buttonText} →
                    </button>
                  </div>
                </div>

                {/* RIGHT: image preview */}
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

          <main className={pageStyles.main}>
            <div className={pageStyles.body}>
              {
                projects.map((project, index) => {
                  return <Project index={index} title={project.title} setModal={setModal} key={index} />
                })
              }
            </div>
            <Modal modal={modal} projects={projects} />
          </main>
          
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
