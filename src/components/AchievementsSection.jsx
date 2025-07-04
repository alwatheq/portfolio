
import { ArrowRight } from "lucide-react";

const achievements = [
  {
  title: "1st Place",
  description: "SUAS 2024 World-Wide Competition",
  imageUrl: "/achievements/suas.png",
  link: "https://www.linkedin.com/posts/alaoniabdulrahman_drone-kfupm-aetaebaepaeqaeqaevabraepaesaexaezaewaeuaeaabraepaesaehaepaesaetaeyaev-activity-7212909822176878592-i9Rp?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_h8HAB-IxbCsqolHOB2JbgIe4-k39kPd8",
},
{
  title: "KFUPM President's Medal",
  description: "Awarded for outstanding distinguished achievements",
  imageUrl: "/achievements/presidents-medal.png",
  link: "https://www.linkedin.com/posts/alaoniabdulrahman_aewaebaepaetabraepaesaezaeoaeyaeb-kfupm-presidentsmedal-activity-7327396668125937664-4Jux?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_h8HAB-IxbCsqolHOB2JbgIe4-k39kPd8",

},
{
  title: "Most Innovative Project",
  description: "KFUPM Senior Project Expo (120 projects)",
  imageUrl: "/achievements/kfupm-expo.png",
  link: "https://www.linkedin.com/posts/alaoniabdulrahman_%D8%A7%D9%84%D9%85%D8%B1%D9%83%D8%A8%D8%A9-%D8%A7%D9%84%D8%A8%D8%B1%D8%AC%D9%88%D9%85%D8%A7%D8%A6%D9%8A%D8%A9-triraptor-%D8%A7%D9%84%D9%85%D8%B1%D9%83%D8%A8%D8%A9-activity-7327993965658398720-97Ey?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_h8HAB-IxbCsqolHOB2JbgIe4-k39kPd8",
},
{
  title: "Winner",
  description: "KFUPM Computer Club Hackathon",
  imageUrl: "/achievements/kfupm-hackathon.png",
  link: "https://www.linkedin.com/posts/alaoniabdulrahman_%D8%A7%D9%84%D8%AD%D9%85%D8%AF%D9%84%D9%84%D9%87-%D8%AF%D8%A7%D8%A6%D9%85%D8%A7-%D8%B3%D8%B9%D9%8A%D8%AF-%D9%84%D9%86%D8%B4%D8%B1-%D9%81%D9%88%D8%B2-%D9%81%D8%B1%D9%8A%D9%82%D9%8A-%D9%85%D9%8A%D9%81%D8%A7%D9%82-activity-7137078413781086208-Rwvh?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_h8HAB-IxbCsqolHOB2JbgIe4-k39kPd8",
},
  {
    title: "3rd Place",
    description: "IoT Squared & Huawei Competition (461 participants)",
    imageUrl: "/achievements/iot-huawei.png",
    link: "https://www.linkedin.com/posts/alaoniabdulrahman_%D8%A7%D9%84%D8%AD%D9%85%D8%AF%D9%84%D9%84%D9%87-%D8%A7%D9%88%D9%84%D8%A7-%D9%88%D8%A7%D8%AE%D8%B1%D8%A7-%D9%83%D9%84%D9%8A-%D9%81%D8%AE%D8%B1-%D9%84%D9%86%D8%B4%D8%B1-%D9%85%D8%B4%D8%A7%D8%B1%D9%83%D8%AA%D9%8A-activity-7108241529399328768-691D?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_h8HAB-IxbCsqolHOB2JbgIe4-k39kPd8",
  },
  {
    title: "3rd Place",
    description: "Techathon Hackathon (Trmez App)",
    imageUrl: "/achievements/techathon.png",
    link: "https://www.linkedin.com/posts/alaoniabdulrahman_techathon-innovation-appdevelopment-activity-7323812314611101696-PEwC?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_h8HAB-IxbCsqolHOB2JbgIe4-k39kPd8",
  },
];

export const AchievementsSection = () => {
  return (
    <section id="achievements" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          <span className="text-primary">Achievements</span>
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          A collection of my proudest accomplishments and recognitions in various competitions and hackathons.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => (
            <a
              key={index}
              href={achievement.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-lg overflow-hidden shadow-sm card-hover block"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={achievement.imageUrl}
                  alt={achievement.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {achievement.description}
                </p>
                <div className="flex justify-end items-center">
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
