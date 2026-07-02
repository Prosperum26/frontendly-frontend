import React from 'react';
import Header from '../components/Header/Header';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-main-bg font-sans">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-main-bg rounded-2xl shadow-xl border border-border p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black text-heading mb-8">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">1. Acceptance of Terms</h2>
              <p className="text-body mb-4">
                By accessing and using FrontEndly, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">2. Description of Service</h2>
              <p className="text-body mb-4">
                FrontEndly is an interactive learning platform designed to help developers master React through hands-on coding exercises, lessons, and real-time feedback. The service includes access to curriculum materials, coding exercises, progress tracking, and community features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">3. User Accounts</h2>
              <p className="text-body mb-4">
                To access certain features of the service, you must register for an account. You agree to provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">4. User Conduct</h2>
              <p className="text-body mb-4">
                You agree to use the service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc pl-6 text-body mb-4">
                <li>Use the service for any illegal purpose or to solicit others to perform or participate in any unlawful acts</li>
                <li>Violate any international, federal, provincial, or local regulations, rules, laws, or local ordinances</li>
                <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, or national origin</li>
                <li>Submit false or misleading information</li>
                <li>Upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">5. Intellectual Property</h2>
              <p className="text-body mb-4">
                All content, features, and functionality of the service, including but not limited to text, graphics, logos, and software, are the exclusive property of FrontEndly and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">6. Privacy Policy</h2>
              <p className="text-body mb-4">
                Your use of the service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the service and describes how we collect, use, and protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">7. Termination</h2>
              <p className="text-body mb-4">
                We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">8. Limitation of Liability</h2>
              <p className="text-body mb-4">
                To the fullest extent permitted by law, FrontEndly shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">9. Governing Law</h2>
              <p className="text-body mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which FrontEndly is based, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">10. Changes to Terms</h2>
              <p className="text-body mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of the service after such modifications constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-heading mb-4">11. Contact Information</h2>
              <p className="text-body mb-4">
                If you have any questions about these Terms, please contact us through our contact page.
              </p>
            </section>

            <p className="text-sm text-muted mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
