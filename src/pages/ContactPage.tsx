import React from 'react';
import { Mail,  Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-main-bg border border-border rounded-2xl p-8 sm:p-12 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-heading mb-3">Contact Us</h1>
          <p className="text-muted text-sm sm:text-base">
            Have a question or feedback about FrontEndly? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="col-span-1 md:col-span-1 bg-surface-raised p-6 rounded-xl border border-border text-center">
            <Mail className="w-6 h-6 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-heading text-sm mb-1">Email</h3>
            <a href="mailto:contact@frontendly.com" className="text-blue-600 text-sm hover:underline">
              contact@frontendly.com
            </a>
          </div>
          <div className="col-span-1 md:col-span-2">
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-heading mb-1.5">Name</label>
                  <input type="text" className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-heading mb-1.5">Email</label>
                  <input type="email" className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-heading mb-1.5">Message</label>
                <textarea rows={4} className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;