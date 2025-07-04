import { Briefcase, Code, User } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-4 relative">
      {" "}
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          About <span className="text-primary"> Me</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">
              Passionate Mechanics Engineer & Mobile Developer
            </h3>

            <p className="text-muted-foreground">
             I'm a Computer Engineering graduate from King Fahd University of Petroleum and Minerals (KFUPM) with a passion for creating technology that makes a real difference. Over the past 4 years, I've developed expertise spanning mobile development, IoT systems, robotics, and full-stack web applications.
            </p>

            <p className="text-muted-foreground">
             My journey includes winning hackathons, placing 3rd in national IoT competitions, and transforming university mobile applications used by thousands of students. I specialize in Flutter mobile development, embedded systems programming.
            </p>
    
          

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">
                {" "}
                Get In Touch
              </a>

              <a
                href="https://cdsfxwpyevlgkusxzexq.supabase.co/storage/v1/object/public/project-images/4ec64e30-84c3-43fd-8d3f-4b070eca1f68/full_cv.pdf"
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                Download CV
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg"> IoT & Embedded Systems</h4>
                  <p className="text-muted-foreground">
                    Building intelligent devices with ESP32, ROS2, 
and sensor fusion. From radiation detectors to 
autonomous vehicles with real-world impact.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-lg">Flutter Development</h4>
                  <p className="text-muted-foreground">
                    Expert mobile developer creating production apps 
used by thousands. Complex state management, 
real-time features, and seamless UX design.
                  </p>
                </div>
              </div>
            </div>
            <div className="gradient-border p-6 card-hover">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>

                <div className="text-left">
                  <h4 className="font-semibold text-lg">Robotics & AI</h4>
                  <p className="text-muted-foreground">
                    Autonomous systems with computer vision, PID 
control, and multi-environment navigation. 
Award-winning innovative solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
