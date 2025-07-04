import { useState } from "react";
import { cn } from "@/lib/utils";

const skills = [
  // Mobile Development
  { name: "Flutter", level: 95, category: "mobile" },
  { name: "Dart", level: 95, category: "mobile" },
  { name: "Firebase", level: 85, category: "mobile" },
  { name: "React Native", level: 70, category: "mobile" },
  { name: "Android Development", level: 80, category: "mobile" },
  { name: "iOS Development", level: 80, category: "mobile" },

  // IoT & Embedded
  { name: "ESP32/Arduino", level: 90, category: "iot" },
  { name: "C/C++", level: 85, category: "iot" },
  { name: "Python", level: 85, category: "iot" },
  { name: "ROS2", level: 80, category: "iot" },
  { name: "MQTT Protocol", level: 85, category: "iot" },
  { name: "Raspberry Pi", level: 85, category: "iot" },
  { name: "Sensor Integration", level: 90, category: "iot" },
  { name: "Computer Vision", level: 75, category: "iot" },
  { name: "PID Control", level: 85, category: "iot" },

  // Backend (including web technologies)
  { name: "Node.js", level: 80, category: "backend" },
  { name: "Bun", level: 75, category: "backend" },
  { name: "Next.js", level: 80, category: "backend" },
  { name: "React", level: 85, category: "backend" },
  { name: "TypeScript", level: 90, category: "backend" },
  { name: "MongoDB", level: 75, category: "backend" },
  { name: "Supabase", level: 80, category: "backend" },

  // Tools
  { name: "Git/GitHub", level: 90, category: "tools" },
  { name: "Docker", level: 75, category: "tools" },
  { name: "VS Code", level: 95, category: "tools" },
  { name: "Platform IO", level: 100, category: "tools" },
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, key) => (
            <div
              key={key}
              className="bg-card p-6 rounded-lg shadow-xs card-hover"
            >
              <div className="text-left mb-4">
                <h3 className="font-semibold text-lg"> {skill.name}</h3>
              </div>
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full origin-left animate-[grow_1.5s_ease-out]"
                  style={{ width: skill.level + "%" }}
                />
              </div>

              <div className="text-right mt-1">
                <span className="text-sm text-muted-foreground">
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
