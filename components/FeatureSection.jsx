// components/FeatureSection.jsx
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureCard({ icon, title, description }) {
  return (
    <Card className="bg-[#CCDAF1] p-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-start">
      <Image
        src={icon}
        alt={`${title} icon`}
        width={56}
        height={56}
        className="mb-4 rounded-sm flex-shrink-0 ml-4"
        loading="lazy"
        placeholder="blur"
        blurDataURL="/placeholder.png"
      />
      <CardContent className="w-full p-0">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-base text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

const features = [
  {
    icon: "https://res.cloudinary.com/dwgwb5vro/image/upload/v1741418260/taskbreakdown_tjjxr0.png?q_auto,f_webp",
    title: "Task Breakdown with AI",
    description:
      "Automate and simplify your tasks for better efficiency and productivity.",
  },
  {
    icon: "https://res.cloudinary.com/dwgwb5vro/image/upload/v1741418260/IntegratedCalender_vvomxj.png?q_auto,f_webp",
    title: "Integrated with Calendar",
    description:
      "Sync your schedule seamlessly and stay on top of important tasks.",
  },
  {
    icon: "https://res.cloudinary.com/dwgwb5vro/image/upload/v1741418260/Asimple_vir8tz.png?q_auto,f_webp",
    title: "A simple and intuitive Kanban Board",
    description:
      "Visualize your workflow, track progress, and stay organized effortlessly.",
  },
  {
    icon: "https://res.cloudinary.com/dwgwb5vro/image/upload/v1741418260/NotificationWa_t5qeuh.png?q_auto,f_webp",
    title: "Notifications with WhatsApp",
    description:
      "Get real-time updates and never miss important tasks or reminders.",
  },
];

export default function FeatureSection() {
  return (
    <section
      id="feature"
      className="py-24 px-4 bg-gray-50" // Tambahkan bg untuk konsistensi dengan AboutSection
      aria-label="Scheduro Features"
    >
      <div className="max-w-screen-lg mx-auto text-center">
        <h3 className="text-[#6387CE] text-xl mb-8 font-bold tracking-wider uppercase">
          FEATURES
        </h3>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 tracking-wider">
          Everything You Need to Stay on Track
        </h2>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto tracking-wider">
          Manage your schedule with ease and stay ahead
          <span className="block text-lg text-gray-700 mt-2">
            effortlessly!
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-14 px-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
