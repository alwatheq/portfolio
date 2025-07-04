import { Navbar } from "../components/Navbar";

import { StarBackground } from "@/components/StarBackground";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { SkillsSection } from "../components/SkillsSection";
import { AchievementsSection } from "../components/AchievementsSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { PageTracker } from "../components/PageTracker";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Page Tracker */}
      <PageTracker />

      {/* Background Effects */}
      <StarBackground />

      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main>
        <div id="hero"> <HeroSection /></div>
        <div id="about"> <AboutSection /></div>
        <div id="skills"> <SkillsSection /></div>
        <div id="achievements"> <AchievementsSection /></div>
        <div id="projects"> <ProjectsSection /></div>
        <div id="contact"> <ContactSection /></div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};
