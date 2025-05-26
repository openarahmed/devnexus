import FinalCTASection from "./components/CallToAction/CallToAciton";
import HeroSection from "./components/HeroSection/HeroSection";
import HowItWorksSection from "./components/HowItWorks/HowItWorks";
import KeyFeaturesSection from "./components/KeyFeatures/KeyFeatures";
import ProblemSolutionSection from "./components/Solutions/Solutions";
import WhyChooseUsSection from "./components/WhyChooseUs/WhyChooseUs";

export default function Home() {
  return (
    <div className="">
      <HeroSection></HeroSection>
      <ProblemSolutionSection></ProblemSolutionSection>
      <HowItWorksSection></HowItWorksSection>
      <KeyFeaturesSection></KeyFeaturesSection>
      <WhyChooseUsSection></WhyChooseUsSection>
      <FinalCTASection></FinalCTASection>
    </div>
  );
}
