import React from "react";
import {
  HelpCircle,
  Zap,
  ListChecks,
  Rocket,
  Lightbulb,
  Users,
  MessageSquare,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HowItWorksSectionProps {}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = () => {
  const steps = [
    {
      icon: <HelpCircle size={48} className="text-blue-400 mb-4" />,
      title: "Answer Smart Questions",
      description:
        "Our creative, AI-powered questionnaire delves into your interests, strengths, and learning preferences. It's quick, insightful, and even a bit fun!",
    },
    {
      icon: <Zap size={48} className="text-purple-400 mb-4" />,
      title: "Receive AI-Driven Insights",
      description:
        "Instantly get personalized suggestions for ideal job roles (Frontend, AI Engineer, etc.), the best tech stacks to learn, and a dynamic, visual learning roadmap.",
    },
    {
      icon: <ListChecks size={48} className="text-green-400 mb-4" />,
      title: "Follow Your Custom Roadmap",
      description:
        "Your interactive roadmap, built with D3.js or a similar library, guides you step-by-step with curated resources and clear milestones.",
    },
    {
      icon: <Rocket size={48} className="text-red-400 mb-4" />,
      title: "Learn, Build & Achieve",
      description:
        "Track your progress, build projects, and gain the skills needed for your dream developer career, all with DevNexus by your side.",
    },
  ];

  return (
    <section className="bg-gray-900 text-white py-16 sm:py-20 md:py-24 px-6 sm:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Your Personalized Tech Blueprint
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            In just a few simple steps, unlock a clear path to your developer
            career.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 bg-gray-700 rounded-full">
                {React.cloneElement(step.icon, { size: 36 })}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-blue-300">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Users className="w-12 h-12 text-teal-400 mx-auto mb-3" />
          <h3 className="text-2xl sm:text-3xl font-semibold text-teal-300 mb-3">
            Plus, Connect & Grow!
          </h3>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Beyond your roadmap, join our{" "}
            <MessageSquare className="inline-block h-5 w-5 text-teal-400 mx-1" />{" "}
            community forums to discuss, share, and learn with fellow
            developers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
