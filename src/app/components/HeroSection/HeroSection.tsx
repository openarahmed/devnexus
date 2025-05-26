import React from "react";
import { ArrowRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeroSectionProps {}

const ReactLogoIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="-11.5 -10.23174 23 20.46348"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
  >
    <circle cx="0" cy="0" r="2.05" fill="currentColor"></circle>
    <g>
      <ellipse rx="11" ry="4.2"></ellipse>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"></ellipse>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"></ellipse>
    </g>
  </svg>
);

const NextJsLogoIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="currentColor"
    viewBox="0 0 180 180"
  >
    <mask
      id="a"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="180"
      height="180"
    >
      <circle cx="90" cy="90" r="90" fill="currentColor"></circle>
    </mask>
    <g mask="url(#a)">
      <circle cx="90" cy="90" r="90" fill="currentColor"></circle>
      <path
        d="M149.508 157.52L69.142 54H54l80.366 103.52h15.142z"
        fill="rgba(0,0,0,0.8)"
      ></path>
      <path
        d="M111.027 54v9.31H69.142V54h41.885z"
        fill="rgba(0,0,0,0.8)"
      ></path>
    </g>
  </svg>
);

const NodeJsLogoIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.52,6.39,13.48,2.24a2.22,2.22,0,0,0-2.09,0L4.34,6.39a2.22,2.22,0,0,0-1.09,1.9V15.7a2.22,2.22,0,0,0,1.09,1.9l7.07,4.15a2.22,2.22,0,0,0,2.09,0l7.07-4.15a2.22,2.22,0,0,0,1.09-1.9V8.29A2.22,2.22,0,0,0,20.52,6.39ZM12,19.85,5.44,16V8.75L12,12.63Zm0-8.54L5.44,7.58,12,3.89l6.56,3.69Zm7.66,4.69L13.13,20V12.37L19.66,8.5Z" />
  </svg>
);

const MongoDbLogoIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16.11,12a4.1,4.1,0,0,1-1.44,3.17c-1.7,1.39-3.43,2.28-5.88,2.28A9.63,9.63,0,0,1,3,10.36a10.4,10.4,0,0,1,3.48-7,12.53,12.53,0,0,1,6.12-2.49c.29,0,.43.31.2.5A6.43,6.43,0,0,0,9.23,3.53a6,6,0,0,0-3,5.68,5.48,5.48,0,0,0,2.08,4.46,4.17,4.17,0,0,0,3.61,1.26c1.8-.34,3.29-1.35,3.29-3.29,0-.5-.29-.8-.72-.8s-.72.3-.72.8a1.86,1.86,0,0,1-2.07,1.93,1.79,1.79,0,0,1-1.86-1.93,1.86,1.86,0,0,1,1.86-1.94,2.07,2.07,0,0,1,2.07,1.94c0,.07,0,.13,0,.2Z" />
  </svg>
);

const TypeScriptLogoIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
    <rect width="24" height="24" rx="3" ry="3" fill="#3178c6" />
    <path
      d="M12.534 10.408L8.942 16.8H6.232l4.422-7.656h1.98l-.72 1.248zm-.288-1.536l-.9-1.56h4.032l-.9 1.56H12.246zM18.268 6.8H10.8v1.86h2.988v8.34h2.292v-8.34h2.188V6.8z"
      fill="#fff"
    />
  </svg>
);

const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center p-6 sm:p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <ReactLogoIcon className="absolute top-[5%] left-[5%] w-1/4 h-1/4 md:w-1/3 md:h-1/3 text-sky-700 transform rotate-12 -translate-x-1/4 -translate-y-1/4" />
        <NextJsLogoIcon className="absolute bottom-[5%] right-[5%] w-1/4 h-1/4 md:w-1/3 md:h-1/3 text-gray-500 transform -rotate-12 translate-x-1/4 translate-y-1/4" />

        <NodeJsLogoIcon className="absolute top-[15%] right-[10%] w-1/5 h-1/5 md:w-1/4 md:h-1/4 text-green-600 transform rotate-[25deg] translate-x-1/3" />
        <MongoDbLogoIcon className="absolute bottom-[15%] left-[10%] w-1/5 h-1/5 md:w-1/4 md:h-1/4 text-emerald-500 transform -rotate-[20deg] -translate-x-1/3" />
        <TypeScriptLogoIcon className="absolute top-1/2 left-1/2 w-1/4 h-1/4 md:w-1/3 md:h-1/3 text-blue-500 transform -translate-x-1/2 -translate-y-1/2 rotate-6" />
      </div>

      <div className="container mx-auto text-center z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          <span className="block">Lost in the Tech Maze?</span>
          <span className="block text-blue-400">
            Find Your Path with DevNexus.
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Stop guessing, start building. DevNexus is your AI-powered co-pilot,
          helping aspiring developers like you choose the perfect career path,
          master the right tech stack, and follow a personalized roadmap to
          success.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a
            href="#questionnaire"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
          >
            Discover Your Developer DNA
            <ArrowRight className="ml-3 h-6 w-6" />
          </a>
          <p className="text-sm text-gray-500 italic">
            Free to start. No CC required.
          </p>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
