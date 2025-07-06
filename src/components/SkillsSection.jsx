import { useState } from "react";
import { cn } from "@/lib/utils";

const skills = [
  // Mobile Development
  { name: "Flutter", category: "mobile" },
  { name: "Dart", category: "mobile" },
  { name: "Clean Architecture", category: "mobile" },
  

  // IoT & Embedded
  { name: "ESP32", category: "iot" },
  { name: "C/C++", category: "iot" },
  { name: "Python", category: "iot" },
  { name: "ROS2", category: "iot" },
  { name: "MQTT Protocol", category: "iot" },
  { name: "Raspberry Pi", category: "iot" },
  { name: "Sensor Integration", category: "iot" },
  { name: "Computer Vision", category: "iot" },
  { name: "PID Control", category: "iot" },

  // Backend (including web technologies)
  { name: "Node.js", category: "backend" },
  { name: "Bun", category: "backend" },
  { name: "TypeScript", category: "backend" },
  { name: "MongoDB", category: "backend" },
  { name: "Supabase", category: "backend" },

  // Tools
  { name: "Git/GitHub", category: "tools" },
  { name: "Docker", category: "tools" },
  { name: "VS Code", category: "tools" },
  { name: "Platform IO", category: "tools" },
];

const categories = ["all", "mobile", "iot", "backend", "tools"];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );
  return (
    <section id="skills" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/70 text-forefround hover:bd-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {filteredSkills.map((skill, key) => (
            <div
              key={key}
              className="bg-card p-4 rounded-lg shadow-xs card-hover flex items-center justify-center"
            >
              <h3 className="font-semibold text-center text-sm">
                {skill.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
