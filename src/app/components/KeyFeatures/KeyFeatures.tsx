import React from "react";
import {
  BrainCircuit,
  ListTree,
  Share2,
  Users,
  LayoutDashboard,
  Sparkles,
  SearchCheck,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  borderColorClass: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  borderColorClass,
}) => (
  <div
    className={`bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 ${borderColorClass} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col`}
  >
    <div className="flex items-center mb-4">
      <div className="p-3 bg-gray-700 rounded-lg mr-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed flex-grow">
      {description}
    </p>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface KeyFeaturesSectionProps {}

const KeyFeaturesSection: React.FC<KeyFeaturesSectionProps> = () => {
  const features = [
    {
      icon: <BrainCircuit size={28} className="text-pink-400" />,
      title: "AI-Powered Career Compass",
      description:
        "Don't just guess your ideal role. Our AI analyzes your profile to suggest career paths and tech stacks truly aligned with you.",
      borderColorClass: "border-pink-500",
    },
    {
      icon: <ListTree size={28} className="text-green-400" />,
      title: "Dynamic Learning Roadmaps",
      description:
        "Get a step-by-step, interactive visual guide. Your roadmap adapts to your goals, pulling curated resources for efficient learning.",
      borderColorClass: "border-green-500",
    },
    {
      icon: <Share2 size={28} className="text-blue-400" />,
      title: "Tech Stack Visualizer",
      description:
        "Experiment and understand tech connections. Drag, drop, and build your dream stack with our interactive canvas, then share it!",
      borderColorClass: "border-blue-500",
    },
    {
      icon: <Users size={28} className="text-teal-400" />,
      title: "Thriving Developer Community",
      description:
        "Connect in real-time forums, share insights, upvote resources, and get support. Learn and grow together with fellow developers.",
      borderColorClass: "border-teal-500",
    },
    {
      icon: <LayoutDashboard size={28} className="text-purple-400" />,
      title: "Personalized Dashboard",
      description:
        "Save your roadmaps, track learning milestones, and set goals. Your journey, your progress, all in one organized place.",
      borderColorClass: "border-purple-500",
    },
    {
      icon: <SearchCheck size={28} className="text-orange-400" />,
      title: "AI Skill Gap Analysis",
      description:
        "Identify exactly which skills you need to develop for your chosen career path, powered by intelligent analysis.",
      borderColorClass: "border-orange-500",
    },
  ];

  return (
    <section className="bg-gray-800 text-white py-16 sm:py-20 md:py-24 px-6 sm:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Launch Your Tech Career
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            DevNexus is packed with interactive and intelligent features
            designed to guide and empower you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              borderColorClass={feature.borderColorClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
