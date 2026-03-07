import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LegalPageProps {
  type: 'terms' | 'privacy' | 'refund';
}

const content = {
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'January 1, 2025',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: `By accessing or using TICIKIFY's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

TICIKIFY is an event ticketing platform that connects event organizers with attendees. We facilitate the sale of tickets but are not responsible for the events themselves.`
      },
      {
        title: '2. User Accounts',
        content: `To use certain features of our platform, you must create an account. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Providing accurate and complete information
• Updating your information as needed

We reserve the right to suspend or terminate accounts that violate these terms.`
      },
      {
        title: '3. Ticket Purchases',
        content: `When you purchase tickets through TICIKIFY:

• All sales are final unless the event is cancelled
• Tickets are non-transferable unless specified otherwise
• You must present a valid ID along with your ticket
• We charge a service fee on all transactions

Refund policies are determined by individual event organizers.`
      },
      {
        title: '4. Organizer Responsibilities',
        content: `Event organizers using our platform must:

• Provide accurate event information
• Honor all sold tickets
• Comply with local laws and regulations
• Maintain appropriate insurance coverage
• Respond to customer inquiries in a timely manner`
      },
      {
        title: '5. Prohibited Activities',
        content: `Users are prohibited from:

• Reselling tickets at inflated prices (scalping)
• Using bots or automated systems to purchase tickets
• Creating fraudulent events or listings
• Harassing other users or organizers
• Attempting to circumvent our security measures`
      },
      {
        title: '6. Limitation of Liability',
        content: `TICIKIFY is not liable for:

• Event cancellations or changes
• Disputes between users and organizers
• Loss of data or profits
• Any indirect, incidental, or consequential damages

Our total liability shall not exceed the amount paid for the specific transaction in question.`
      },
      {
        title: '7. Governing Law',
        content: `These Terms of Service are governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka, Bangladesh.`
      },
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'January 1, 2025',
    sections: [
      {
        title: '1. Information We Collect',
        content: `We collect the following types of information:

Personal Information:
• Name, email address, phone number
• Billing and payment information
• Government-issued ID (for verification)

Usage Information:
• Device information and IP address
• Browser type and operating system
• Pages visited and actions taken

Event Information:
• Events you've purchased tickets for
• Events you've shown interest in
• Reviews and feedback you provide`
      },
      {
        title: '2. How We Use Your Information',
        content: `We use your information to:

• Process ticket purchases and payments
• Send event reminders and updates
• Provide customer support
• Improve our services and user experience
• Comply with legal obligations
• Prevent fraud and abuse`
      },
      {
        title: '3. Information Sharing',
        content: `We may share your information with:

• Event organizers (limited to necessary information)
• Payment processors (bKash, Nagad, etc.)
• Service providers who assist our operations
• Law enforcement when required by law

We do not sell your personal information to third parties.`
      },
      {
        title: '4. Data Security',
        content: `We implement appropriate security measures to protect your information:

• SSL encryption for data transmission
• Regular security audits
• Access controls and authentication
• Secure data storage practices

However, no method of transmission over the internet is 100% secure.`
      },
      {
        title: '5. Your Rights',
        content: `You have the right to:

• Access your personal information
• Request correction of inaccurate data
• Request deletion of your data
• Opt out of marketing communications
• Withdraw consent where applicable

To exercise these rights, contact us at privacy@ticikify.com`
      },
      {
        title: '6. Cookies and Tracking',
        content: `We use cookies and similar technologies to:

• Remember your preferences
• Analyze site traffic and usage
• Personalize content and recommendations
• Improve site functionality

You can control cookies through your browser settings.`
      },
      {
        title: '7. Changes to This Policy',
        content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the updated policy.`
      },
    ]
  },
  refund: {
    title: 'Refund Policy',
    lastUpdated: 'January 1, 2025',
    sections: [
      {
        title: '1. General Refund Policy',
        content: `At TICIKIFY, we understand that plans can change. Our refund policy is designed to be fair to both attendees and event organizers.

General Rules:
• All ticket sales are final unless otherwise specified
• Refund eligibility is determined by the event organizer
• Service fees are non-refundable
• Refunds are processed to the original payment method`
      },
      {
        title: '2. Event Cancellation',
        content: `If an event is cancelled by the organizer:

• Full ticket price will be refunded
• Service fees will be refunded
• Refunds are processed within 5-10 business days
• You will be notified via email and SMS

If an event is postponed:
• Your tickets remain valid for the new date
• Refunds may be available if you cannot attend the new date
• Contact the organizer for refund requests`
      },
      {
        title: '3. Refund Requests',
        content: `To request a refund:

1. Log into your TICIKIFY account
2. Go to "My Tickets"
3. Select the ticket you want to refund
4. Click "Request Refund"
5. Provide a reason for the refund

Refund requests must be made at least 48 hours before the event start time.`
      },
      {
        title: '4. Non-Refundable Situations',
        content: `Refunds will NOT be issued for:

• No-shows or late arrivals
• Events that proceed as scheduled
• Change of mind after purchase
• Tickets purchased from unauthorized resellers
• Events where entry was denied due to violation of terms

Service fees are non-refundable in all cases.`
      },
      {
        title: '5. Organizer Refund Policies',
        content: `Individual organizers may have their own refund policies:

• Check the event page for specific refund terms
• Some events may offer full refunds up to a certain date
• Others may offer partial refunds or exchanges
• Charity events are typically non-refundable

Organizer policies are displayed on each event page.`
      },
      {
        title: '6. Refund Processing',
        content: `Refund processing details:

• Refunds are processed within 5-10 business days
• You will receive an email confirmation
• Refunds appear in your account within 3-5 additional business days
• Original service fees are deducted from refunds

For payment issues, contact support@ticikify.com`
      },
      {
        title: '7. Contact Us',
        content: `For refund-related inquiries:

Email: refunds@ticikify.com
Phone: +880 1234-567890
Hours: Sunday-Thursday, 9 AM - 6 PM BST

Please include your order number in all refund communications.`
      },
    ]
  }
};

export default function Legal({ type }: LegalPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const pageContent = content[type];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div ref={containerRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {pageContent.title}
            </h1>
            <p className="text-gray-400">
              Last updated: {pageContent.lastUpdated}
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {pageContent.sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-dark-50 rounded-2xl p-6 border border-white/5"
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/5 text-center"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Have Questions?
            </h3>
            <p className="text-gray-400 mb-4">
              Contact our support team for assistance with any legal inquiries.
            </p>
            <a 
              href="mailto:legal@ticikify.com" 
              className="text-cyan-400 hover:underline"
            >
              legal@ticikify.com
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
