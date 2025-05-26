import React from "react";
import { ArrowRight, Rocket, Star } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FinalCTASectionProps {}

const FinalCTASection: React.FC<FinalCTASectionProps> = () => {
  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 sm:py-28 md:py-32 px-6 sm:px-8">
      <div className="container mx-auto max-w-4xl text-center">
        <Rocket className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-pulse" />
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Ready to Decode Your Developer Future?
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join thousands of aspiring developers who are finding clarity and
          building their dream careers with DevNexus. Your journey into tech
          starts now – let us help you navigate it.
        </p>
        <a
          href="#questionnaire" // Should link to signup or questionnaire
          className="inline-flex items-center justify-center px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 text-xl"
        >
          Get Your Free Personalized Roadmap
          <ArrowRight className="ml-3 h-7 w-7" />
        </a>
        <div className="mt-12 flex justify-center items-center space-x-2 text-yellow-400">
          <Star size={20} className="fill-current" />
          <Star size={20} className="fill-current" />
          <Star size={20} className="fill-current" />
          <Star size={20} className="fill-current" />
          <Star size={20} className="fill-current" />
          <p className="ml-2 text-gray-400 text-sm">
            Trusted by aspiring developers worldwide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
