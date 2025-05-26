import React from "react";
import { CheckCircle, Users, Target, Lightbulb, Zap } from "lucide-react";

interface BenefitPointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitPoint: React.FC<BenefitPointProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700/60 transition-colors duration-300">
    <div className="flex-shrink-0 mt-1 text-green-400">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WhyChooseUsSectionProps {}

const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = () => {
  const benefits = [
    {
      icon: <Target size={28} />,
      title: "Solve a Real Problem",
      description:
        "We address the #1 challenge for aspiring developers: 'Where do I even start?' Get clarity, not confusion.",
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Truly Personalized Guidance",
      description:
        "No generic advice. Your roadmap and recommendations are AI-tailored to your unique interests, personality, and goals.",
    },
    {
      icon: <Zap size={28} />,
      title: "Interactive & Engaging Platform",
      description:
        "Learning and planning shouldn't be a chore. Our tools make discovering your path and tracking progress enjoyable and motivating.",
    },
    {
      icon: <Users size={28} />,
      title: "Built with Modern Tech, For You",
      description:
        "Experience a sleek, accessible, and powerful platform designed with the best of today's web technologies – the same tech you'll be mastering!",
    },
  ];

  return (
    <section className="bg-gray-900 text-white py-16 sm:py-20 md:py-24 px-6 sm:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 sm:mb-16">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            More Than Just a Platform – It is Your Career Accelerator.
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Here’s why DevNexus stands out in helping you launch and navigate
            your developer journey:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitPoint
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
