import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-main-bg border border-border rounded-2xl p-8 sm:p-12 shadow-sm">
        <h1 className="text-3xl font-bold text-heading mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm mb-8 pb-8 border-b border-border">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-body text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-heading mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              When you use FrontEndly, we collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted">
              <li>Account information (name, email address, password).</li>
              <li>Profile data (learning progress, XP, badges, submitted code).</li>
              <li>Communication data when you contact our support team.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted">
              <li>Provide, maintain, and improve the FrontEndly learning platform.</li>
              <li>Track your progress and display your rank on the Leaderboard.</li>
              <li>Send you technical notices, updates, and security alerts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading mb-3">3. Code Submissions & Workspace</h2>
            <p className="text-muted">
              The code you write in the Quick Workspace and submit for Challenges is stored securely on our servers to evaluate your progress. We do not claim ownership of your original code, but we reserve the right to review it for platform security and abuse prevention.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-heading mb-3">4. Contact Us</h2>
            <p className="text-muted">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@frontendly.com" className="text-blue-600 hover:underline">contact@frontendly.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;