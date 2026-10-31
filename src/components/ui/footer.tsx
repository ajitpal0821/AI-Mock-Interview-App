import React from "react";
import { Link } from "react-router-dom";
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail 
} from "lucide-react";
import { Container } from "./container";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-[#d2d2d7]/60 dark:border-neutral-800/80 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:border-[#86868b] dark:hover:border-neutral-700 transition-all duration-200 shadow-xs"
    >
      {icon}
    </a>
  );
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f5f5f7] dark:bg-[#0a0a0c] text-[#86868b] border-t border-[#d2d2d7]/60 dark:border-neutral-800 transition-colors">
      <Container className="pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-[#d2d2d7]/60 dark:border-neutral-800">
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
              <img 
                src="/assets/svg/logo.svg" 
                alt="MockAI Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-semibold text-base tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                MockAI
              </span>
            </Link>
            <p className="text-xs text-[#86868b] leading-relaxed max-w-sm">
              The professional standard for technical and behavioral interview preparation. 
              Engineered to build authentic candidate confidence through precise voice simulation 
              and objective evaluation.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <SocialLink 
                href="https://github.com" 
                icon={<Github className="w-4 h-4" />} 
                label="GitHub"
              />
              <SocialLink 
                href="https://linkedin.com" 
                icon={<Linkedin className="w-4 h-4" />} 
                label="LinkedIn"
              />
              <SocialLink 
                href="https://twitter.com" 
                icon={<Twitter className="w-4 h-4" />} 
                label="Twitter"
              />
              <SocialLink 
                href="mailto:contact@mockai.app" 
                icon={<Mail className="w-4 h-4" />} 
                label="Email"
              />
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/generate" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Interview Studio
                </Link>
              </li>
              <li>
                <Link to="/generate/create" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Custom Scenarios
                </Link>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  Capabilities & Features
                </a>
              </li>
            </ul>
          </div>

          {/* Practice Areas */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
              Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer">
                Frontend Engineering
              </li>
              <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer">
                Backend Architecture
              </li>
              <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer">
                Full-Stack Systems
              </li>
              <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer">
                Behavioral & Leadership
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7]">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer">
                Privacy Architecture
              </li>
              <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer">
                Security Overview
              </li>
              <li className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors cursor-pointer">
                Contact Enterprise
              </li>
            </ul>
          </div>
        </div>

        {/* Apple-style Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#86868b]">
            <p>Copyright © {currentYear} MockAI Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer transition-colors">Terms of Use</span>
              <span>·</span>
              <span className="hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer transition-colors">Legal</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#86868b]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium">All Systems Operational</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;