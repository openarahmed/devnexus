import React from "react";
import { Lightbulb, Network, TrendingUp, AlertTriangle } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ProblemSolutionSectionProps {}

const ProblemSolutionSection: React.FC<ProblemSolutionSectionProps> = () => {
  return (
    <section className="bg-gray-800 text-white py-16 sm:py-20 md:py-24 px-6 sm:px-8">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="mb-12">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Overwhelmed by Options? You are Not Alone.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-left md:pr-8">
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6">
              The world of software development is vast and exciting, but
              knowing where to begin can be daunting. Which programming
              language? Which framework? Frontend, backend, DevOps, AI? The
              choices seem endless, and the fear of picking the wrong path can
              be paralyzing.
            </p>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Many aspiring developers spend countless hours sifting through
              conflicting advice, feeling more confused than confident.
            </p>
          </div>

          <div className="relative p-6 bg-gray-700 rounded-xl shadow-xl">
            <div className="absolute -top-4 -left-4 opacity-20">
              <Network
                size={80}
                className="text-blue-400 transform rotate-12"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 opacity-20">
              <Lightbulb
                size={80}
                className="text-yellow-300 transform -rotate-12"
              />
            </div>
            <div className="relative z-10">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-green-300 mb-3">
                DevNexus Cuts Through the Noise.
              </h3>
              <p className="text-md text-gray-200 leading-relaxed">
                We provide clarity and direction, transforming your unique
                interests, learning style, and personality into a tailored guide
                for your tech career. Say goodbye to confusion and hello to a
                confident start.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
