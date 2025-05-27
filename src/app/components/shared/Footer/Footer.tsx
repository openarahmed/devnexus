import React from "react";
import { Github, Linkedin, Twitter, Copyright } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
  >
    {children}
  </a>
);

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 sm:py-16 px-6 sm:px-8">
      <div>
        <Link href="/chat">
          {" "}
          <Image
            src="https://i.postimg.cc/qMnc0mQC/steptodown-com202563.png" // Path to your image in the public folder
            alt="ChatBot"
            width={500} // Desired width in pixels
            height={500} // Desired height in pixels
            priority // Optional: preload the image
            className="w-15 absolute right-5 fixed bottom-5"
          />
        </Link>
      </div>
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h5 className="text-lg font-semibold text-white mb-3">DevNexus</h5>
            <p className="text-sm">
              Your AI-powered guide to navigating the world of software
              development. Find your path, build your skills, and launch your
              career.
            </p>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <FooterLink href="#hero">Home</FooterLink>
              </li>
              <li>
                <FooterLink href="#features">Features</FooterLink>
              </li>
              <li>
                <FooterLink href="#faq">FAQ</FooterLink>
              </li>
              <li>
                <FooterLink href="#contact">Contact Us</FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white mb-3">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink href="/termsofservice">Terms of Service</FooterLink>
              </li>
              <li>
                <FooterLink href="/cookies">Cookie Policy</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm flex items-center mb-4 sm:mb-0">
            <Copyright size={16} className="mr-2" />
            <span>{currentYear} DevNexus. All Rights Reserved.</span>
          </div>
          <div className="flex space-x-5">
            <FooterLink href="https://github.com">
              <Github size={22} />
            </FooterLink>
            <FooterLink href="https://linkedin.com">
              <Linkedin size={22} />
            </FooterLink>
            <FooterLink href="https://twitter.com">
              <Twitter size={22} />
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
