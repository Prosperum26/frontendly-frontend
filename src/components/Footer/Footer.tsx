import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-main-bg border-t border-border p-12 grid grid-cols-5 gap-10">
      <div className="col-span-2">
        <div className="text-xl font-bold text-heading mb-2">FrontEndly</div>
        <p className="text-body mb-4 text-sm">Keep going, you're doing great!</p>
        <p className="text-xs text-muted">
          © 2026 FrontEndly. Built for developers by developers. <br />
          Empowering the next generation of engineers with precision-crafted curriculum.
        </p>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-heading mb-4 uppercase tracking-wider">Curriculum</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              HTML Path
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              CSS Mastery
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              JS Challenges
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-heading mb-4 uppercase tracking-wider">Community</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Global Rankings
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Showcase
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Discord
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-heading mb-4 uppercase tracking-wider">Company</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              About Us
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
