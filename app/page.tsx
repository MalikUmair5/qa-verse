'use client'
import Image from "next/image";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import TypewriterText from "@/layout/TypewriterText";
import Loader from "@/components/ui/loader";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const testingTips = [
    "Always test edge cases - they reveal the most bugs!",
    "Document every bug with clear steps to reproduce.",
    "Test early and test often for better results.",
    "User experience matters - test from user's perspective.",
    "Regression testing prevents old bugs from returning.",
    "Performance testing ensures smooth user experience."
  ];

  useEffect(() => {
    // Simulate initial page loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Cycle through testing tips
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % testingTips.length);
    }, 8000); // Change tip every 8 seconds

    return () => clearInterval(tipInterval);
  }, [testingTips.length]);

  useEffect(() => {
    if (loading) return;
    // GSAP animations for scroll-triggered elements
    const ctx = gsap.context(() => {
      // Hero section background animation
      gsap.from(heroRef.current, {
        scale: 1.1,
        duration: 2,
        ease: "power2.out"
      });

      // Simple features animation
      gsap.fromTo(".feature-card",
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

    }, heroRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Header />

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-secondary via-background to-background-alt overflow-hidden"
        >
          {/* Floating Background Elements & Testing Animations */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Bug Crawling Animation - Higher position to avoid text */}
            <motion.div
              className="absolute top-4 w-6 h-6 text-bug-purple opacity-20 hidden md:block"
              animate={{
                x: ['-100px', 'calc(100vw + 100px)'],
                rotate: [0, 360]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: 0
              }}
            >
              🐛
            </motion.div>

            {/* Code Scanning Line - Positioned away from text */}
            <div className="absolute top-16 w-full h-px bg-gradient-to-r from-transparent via-test-green to-transparent opacity-30 hidden md:block">
              <motion.div
                className="w-20 h-full bg-test-green opacity-60 blur-sm"
                animate={{ x: ['-100px', 'calc(100vw + 100px)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Floating Test Icons - Positioned in corners */}
            <motion.div
              className="floating-icon absolute top-8 left-4 md:top-20 md:left-20 w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center"
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
                y: [0, -15, 0]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <span className="text-primary text-lg md:text-2xl">⚙️</span>
            </motion.div>

            {/* Testing Badge - Right side, away from text */}
            <motion.div
              className="floating-icon absolute top-8 right-4 md:top-40 md:right-32 w-16 h-10 md:w-20 md:h-12 bg-test-green/10 rounded-lg flex items-center justify-center border border-test-green/20"
              animate={{
                rotate: [-5, 5, -5],
                y: [0, -10, 0]
              }}
              transition={{
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <span className="text-test-green text-xs font-bold">PASS</span>
            </motion.div>

            {/* Error Badge - Bottom left, minimal on mobile */}
            <motion.div
              className="floating-icon absolute bottom-8 left-4 md:bottom-40 md:left-32 w-16 h-10 md:w-20 md:h-12 bg-test-red/10 rounded-lg flex items-center justify-center border border-test-red/20 opacity-50 md:opacity-100"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-test-red text-xs font-bold">FAIL</span>
            </motion.div>

            {/* Code Lines - Hidden on mobile */}
            <motion.div
              className="absolute bottom-60 right-20 w-24 h-1 bg-muted/20 hidden md:block"
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div
              className="absolute bottom-56 right-20 w-16 h-1 bg-muted/20 hidden md:block"
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />

            {/* Testing Progress Circle - Bottom right corner */}
            <motion.div
              className="absolute bottom-8 right-4 md:top-60 md:left-40 w-12 h-12 md:w-16 md:h-16 border-2 md:border-4 border-border/30 rounded-full opacity-30 md:opacity-100"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="w-full h-full border-t-2 md:border-t-4 border-primary rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            {/* Cursor Trail Animation */}
            <motion.div
              className="absolute w-4 h-4 bg-primary rounded-full opacity-20 hidden lg:block"
              animate={{
                x: [100, 200, 300, 250, 150],
                y: [100, 150, 200, 250, 180],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="w-2 h-2 bg-primary rounded-full absolute top-1 left-1"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              >
                Find Bugs, Earn Rewards,{" "}
                <motion.span
                  className="text-primary block"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Shape the Future.
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-muted mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Project Pilot connects student testers with new software projects. Help
                Developers, build your skills and climb the leaderboard
              </motion.p>

              <motion.div
                className="flex gap-6 justify-center flex-col sm:flex-row max-w-md mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <button className="bg-[#A33C13] text-white hover:bg-[#8a2f0f] shadow-lg hover:shadow-xl w-full sm:w-auto border-2 px-8 py-4 rounded-lg transition-all duration-300 font-medium text-lg">
                    I&apos;m a Tester
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto"
                >
                  <button className="w-full sm:w-auto bg-transparent text-foreground border-2 border-foreground px-8 py-4 rounded-lg hover:bg-foreground hover:text-white transition-all duration-300 font-medium text-lg">
                    I&apos;m a Product Owner
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>


          {/* Floating Testing Tip */}
          <motion.div
            key={currentTipIndex}
            className="fixed bottom-6 right-6 bg-[#F3ECE9] rounded-xl  p-4 max-w-xs border-l-4 border-primary z-50 hidden lg:block"
            initial={{ x: 400, opacity: 0 }}
            animate={{
              x: [400, 0, 0, 400],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 8,
              delay: 1,
              repeat: Infinity,
              repeatDelay: 8,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-start space-x-3">
              <motion.div
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span className="text-white text-sm">💡</span>
              </motion.div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">Testing Tip</h4>
                <p className="text-muted text-xs mt-1">
                  {testingTips[currentTipIndex]}
                </p>
              </div>
            </div>
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-test-green rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="features-section py-20 bg-[#F3ECE9]">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                A simple, gamified approach to software testing
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 - Explore Projects */}
              <motion.div
                className="feature-card text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <motion.div
                    className="w-full h-full"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%']
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#A33C13'} 10px, transparent 20px)`
                    }}
                  />
                </div>

                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg relative"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    // animate={{ scale: [1, 1.1, 1] }}
                    // transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10"
                  >
                    <Image
                      src="/find.png"
                      alt="Find Projects"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  {/* Scanning Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Explore Projects</h3>
                <p className="text-muted leading-relaxed">
                  Browse a diverse list of new software projects looking for feedback
                </p>

                {/* Project Icons Animation */}
                <div className="flex justify-center mt-4 space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-primary/30 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Feature 2 - Submit Bugs */}
              <motion.div
                className="feature-card text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                {/* Bug Trail Animation */}
                <motion.div
                  className="absolute top-2 right-2 text-sm opacity-20"
                  animate={{
                    x: [0, -200, -400],
                    y: [0, 20, 40],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  🐛
                </motion.div>

                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-test-red to-test-yellow rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg relative"
                  whileHover={{
                    boxShadow: "0 0 30px rgba(244, 67, 54, 0.4)",
                    scale: 1.05
                  }}
                >
                  <motion.div
                    // animate={{ 
                    //   rotate: [0, 5, -5, 0],
                    //   scale: [1, 1.1, 1]
                    // }}
                    // transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10"
                  >
                    <Image
                      src="/greenBug.png"
                      alt="Submit Bugs"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  {/* Alert Pulse */}
                  <motion.div
                    className="absolute inset-0 border-2 border-test-red rounded-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Submit Bugs</h3>
                <p className="text-muted leading-relaxed">
                  Found an issue? Submit a detailed bug report using our streamlined form.
                </p>

                {/* Bug Report Status */}
                <div className="mt-4 flex justify-center space-x-1">
                  <motion.div className="w-2 h-2 bg-test-red rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div className="w-2 h-2 bg-test-yellow rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.div className="w-2 h-2 bg-test-green rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                  />
                </div>
              </motion.div>

              {/* Feature 3 - Earn XP & Climb */}
              <motion.div
                className="feature-card text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-test-green to-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg relative"
                  whileHover={{
                    boxShadow: "0 0 30px rgba(76, 175, 80, 0.4)",
                    rotate: [0, 360]
                  }}
                  transition={{ rotate: { duration: 1 } }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-10 h-10"
                  >
                    <Image
                      src="/reward.png"
                      alt="Earn Rewards"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>

                  {/* Level Up Effect */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-test-yellow rounded-full flex items-center justify-center text-xs font-bold text-white"
                    animate={{
                      scale: [0, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    +1
                  </motion.div>
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Earn XP & Climb</h3>
                <p className="text-muted leading-relaxed">
                  Gain experience points for every valid bug and compete on the global leaderboard.
                </p>

                {/* Progress Bar Animation */}
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-test-green to-primary h-2 rounded-full"
                    animate={{ width: ['0%', '75%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <motion.p
                  className="text-xs text-muted mt-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Level Progress
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Testing Demo Section */}
        <section className="py-20 bg-gradient-to-br from-secondary/30 to-background relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Experience QA in Action
              </h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                Watch our AI-powered testing in real-time
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Live Bug Counter */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-test-red relative overflow-hidden"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Bug Discovery Rate</h3>

                </div>
                <motion.div
                  className="text-4xl font-bold text-test-red mb-2"
                >
                  247
                </motion.div>
                <div className="flex items-center">
                  <motion.div
                    className="w-3 h-3 bg-test-red rounded-full mr-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-muted text-sm">+12 in last hour</span>
                </div>

                {/* Animated Background */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-test-red/5 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* Test Speed Meter */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-test-green relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Test Coverage</h3>

                </div>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 0.85 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      style={{
                        strokeDasharray: "283",
                        strokeDashoffset: "283"
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-test-green">85%</span>
                  </div>
                </div>
                <p className="text-center text-muted text-sm">Tests/min</p>
              </motion.div>

              {/* Live Tester Activity */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-primary relative overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Live Testers</h3>
                </div>

                {/* Tester Avatars */}
                <div className="flex -space-x-2 mb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${i % 2 === 0 ? 'bg-primary' : 'bg-test-green'
                        }`}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      animate={{ y: [0, -2, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </motion.div>
                  ))}
                </div>

                <motion.p
                  className="text-primary font-semibold"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  1,847 active now
                </motion.p>
                <p className="text-muted text-sm">Testing across 23 projects</p>

                {/* Activity Pulses */}
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-test-green rounded-full"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [1, 0, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>

            {/* Typing Animation */}
            <motion.div
              className="mt-16 bg-gray-900 rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-test-red rounded-full"></div>
                  <div className="w-3 h-3 bg-test-yellow rounded-full"></div>
                  <div className="w-3 h-3 bg-test-green rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-400 font-mono">Live Bug Report</span>
              </div>

              <div className="font-mono text-sm space-y-3">
                <TypewriterText
                  text="Bug Report #1247"
                  className="text-test-red font-bold"
                  delay={0}
                />
                <TypewriterText
                  text="Location: Login Form - Password Field"
                  className="text-gray-300"
                  delay={1}
                />
                <TypewriterText
                  text="Severity: High"
                  className="text-test-yellow"
                  delay={2}
                />
                <TypewriterText
                  text="Description: Password validation fails with special characters..."
                  className="text-gray-300"
                  delay={3}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.5, duration: 0.5 }}
                  className="flex items-center space-x-2 text-test-green"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 inline-block"
                  >
                    ⚙️
                  </motion.span>
                  <span>Auto-assigning to development team...</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Reduced Floating Data Points */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                style={{
                  left: `${20 + (i * 20)}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1
                }}
              />
            ))}
          </div>
        </section>

        {/* Testing Lab Section - New Testing Animation Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Testing Lab
              </h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                See our testing process in action
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Testing Console Animation */}
              <div className="relative">
                <motion.div
                  className="bg-gray-900 rounded-lg p-6 font-mono text-sm relative overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {/* Console Header */}
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-test-red rounded-full"></div>
                      <div className="w-3 h-3 bg-test-yellow rounded-full"></div>
                      <div className="w-3 h-3 bg-test-green rounded-full"></div>
                    </div>
                    <span className="ml-4 text-gray-400">QA Testing Console</span>
                  </div>

                  {/* Console Content */}
                  <div className="text-gray-300 space-y-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      <span className="text-test-green">$</span> npm run test
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                      className="text-gray-400"
                    >
                      Running test suite...
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2, duration: 0.5 }}
                      className="flex items-center space-x-2"
                    >
                      <motion.span
                        className="text-test-green"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ✓
                      </motion.span>
                      <span>Login functionality</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5, duration: 0.5 }}
                      className="flex items-center space-x-2"
                    >
                      <motion.span
                        className="text-test-red"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ✗
                      </motion.span>
                      <span>Payment process</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3, duration: 0.5 }}
                      className="flex items-center space-x-2"
                    >
                      <motion.span
                        className="text-test-yellow"
                        animate={{ rotate: [0, 180, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⚠
                      </motion.span>
                      <span>Form validation</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.5, duration: 0.5 }}
                      className="text-test-green"
                    >
                      Tests: 2 passed, 1 failed, 1 warning
                    </motion.div>
                  </div>

                  {/* Scanning Line Effect */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{
                      y: [0, 300, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>

              {/* Testing Metrics */}
              <div className="space-y-6">
                {/* Bug Discovery Rate */}
                <motion.div
                  className="bg-gradient-to-r from-secondary to-background-alt p-6 rounded-xl border border-border/20"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground">Bug Discovery Rate</h4>
                  </div>
                  <div className="bg-white rounded-full h-3 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-test-red to-primary h-3 rounded-full"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '87%' }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="text-muted text-sm">87% bugs found in first testing round</p>
                </motion.div>

                {/* Test Coverage */}
                <motion.div
                  className="bg-gradient-to-r from-background-alt to-secondary p-6 rounded-xl border border-border/20"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground">Test Coverage</h4>
                  </div>
                  <div className="bg-white rounded-full h-3 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-test-green to-primary h-3 rounded-full"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '94%' }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <p className="text-muted text-sm">94% code coverage achieved</p>
                </motion.div>

                {/* Active Testers */}
                <motion.div
                  className="bg-gradient-to-r from-secondary to-background-alt p-6 rounded-xl border border-border/20"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground">Active Testers</h4>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-test-green rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <motion.p
                    className="text-3xl font-bold text-primary mb-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    2,847
                  </motion.p>
                  <p className="text-muted text-sm">Testers online right now</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Background Testing Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Code Snippets */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-border/10 font-mono text-xs"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.3, 0.1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                {['function()', 'test()', 'assert()', 'expect()', 'describe()', 'it()'][i]}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: "Projects Tested" },
                { number: "10K+", label: "Bugs Found" },
                { number: "2K+", label: "Active Testers" },
                { number: "95%", label: "Success Rate" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-white"
                >
                  <motion.h3
                    className="text-3xl md:text-4xl font-bold mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-white/80">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
