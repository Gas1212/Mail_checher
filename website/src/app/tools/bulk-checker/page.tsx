'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, Upload, Download, Sparkles, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolContent from '@/components/tools/ToolContent';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import UpgradeModal from '@/components/ui/UpgradeModal';
import RelatedTools from '@/components/tools/RelatedTools';

export default function BulkCheckerPage() {
  const [emails, setEmails] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const validateEmails = async () => {
    // Bulk validation requires authentication
    // Show upgrade modal to encourage sign up
    setShowUpgradeModal(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bulk Email Checker
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Validate multiple email addresses at once. Create a free account to get started with 100 free validations per month.
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-8">
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="emails" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Addresses (one per line)
                  </label>
                  <textarea
                    id="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="example1@domain.com&#10;example2@domain.com&#10;example3@domain.com"
                    rows={10}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm text-gray-900 placeholder:text-gray-400 bg-white"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {emails.split('\n').filter(e => e.trim().length > 0).length} emails entered
                  </p>
                </div>

                <Button
                  onClick={validateEmails}
                  disabled={!emails.trim()}
                  className="w-full"
                  size="lg"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Validate Emails
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Bulk validation requires a free account
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How It Works
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <Upload className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Upload or Paste:</strong> Enter email addresses one per line or paste from Excel/CSV</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Instant Validation:</strong> Each email is checked for syntax, domain, MX records, and disposable detection</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Export Results:</strong> Download results as CSV for easy integration with your tools</p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Account Required:</strong> Bulk validation requires a free account. Sign up to get 100 free validations per month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <RelatedTools
        tools={[
          {
            name: 'Email Validator',
            description: 'Verify single emails instantly',
            href: '/tools/email-checker',
            icon: Mail,
            color: 'from-indigo-500 to-purple-500',
          },
          {
            name: 'List Cleaner',
            description: 'Remove duplicates from lists',
            href: '/tools/list-cleaner',
            icon: Sparkles,
            color: 'from-purple-500 to-pink-500',
          },
          {
            name: 'Blacklist Checker',
            description: 'Check domain blacklist status',
            href: '/tools/blacklist-checker',
            icon: Shield,
            color: 'from-red-500 to-orange-500',
          },
        ]}
      />

      <ToolContent
        schemaId="bulk-checker-faq"
        sections={[
          {
            h2: "Validating Thousands of Email Addresses at Scale",
            content: "Bulk email validation solves the persistent challenge of cleaning accumulated contact databases. When you have collected thousands of email addresses through years of marketing, sign-ups, and lead generation, manual review is impossible. Our bulk checker processes your entire list automatically, running each address through syntax checking, DNS/MX verification, SMTP handshake testing, and disposable email detection in parallel.\n\nThe tool accepts CSV files and plain text lists with one email per line. Each address is processed concurrently, allowing a list of 10,000 addresses to be validated in under 10 minutes. The output preserves your original data structure, appending validation columns — status, sub-status, domain quality score, MX information — to each row, making it simple to filter results in any spreadsheet or CRM.\n\nResults are downloadable in the same format as your input, making it easy to import clean lists directly into your email platform of choice without reformatting or manual data manipulation.",
          },
          {
            h2: "Interpreting Bulk Validation Results and Status Codes",
            content: "Bulk validation returns nuanced status codes beyond simple valid/invalid classifications. Valid addresses have passed all checks and show high deliverability probability. Invalid addresses have definitively failed — the mailbox does not exist, the domain has no MX records, or the syntax is malformed. These should be permanently removed from all sending lists.\n\nCatch-all addresses require strategic handling. These come from domains configured to accept all incoming email, making per-mailbox confirmation impossible. For recognized company domains, catch-all addresses are generally worth retaining. For unknown domains, suppression is safer. The domain quality score in our results helps make this judgment.\n\nDisposable and role-based flags add further segmentation capability. Disposable addresses indicate users who used temporary emails to avoid contact. Role-based addresses like info@, admin@, and support@ represent generic inboxes monitored by multiple people, appropriate for some communications but not for personalized outreach.",
          },
          {
            h2: "Compliance and Data Privacy in Bulk Validation",
            content: "Processing large email lists requires careful attention to data protection regulations. Under GDPR and CCPA, email addresses are classified as personal data, and bulk processing requires appropriate legal basis and data handling practices. Understanding how your validation service handles data is essential for compliance.\n\nOur bulk validator processes addresses transiently — data is not stored after validation completes, no secondary use occurs, and all connections are encrypted via HTTPS. Validation results are available for download for 24 hours before automatic deletion. For strict data residency requirements, our API supports on-premises deployment.\n\nFrom a marketing compliance perspective, bulk validation helps maintain accurate suppression lists. Removing invalid addresses before sending demonstrates responsible list management to ISPs, positively impacting your sender reputation score. Documented validation practices also support compliance demonstrations if your email practices are ever audited by regulatory bodies or email service providers.",
          },
        ]}
        faqs={[
          {
            q: "What file formats does the bulk validator accept?",
            a: "The bulk validator accepts CSV files (comma or semicolon delimited), TSV files, and plain text files with one email per line. For CSV files, you specify which column contains email addresses and all other columns are preserved in the output. This makes it easy to validate lists exported directly from your CRM, email platform, or spreadsheet without reformatting.",
          },
          {
            q: "How long does bulk validation take?",
            a: "Processing speed depends on list size and domain diversity. A list of 1,000 addresses typically completes in 1-2 minutes. Lists of 10,000 addresses take 5-15 minutes, while 100,000-address lists can take 30-90 minutes. Speed varies because SMTP verification requires real network connections to mail servers, and some servers impose connection rate limits that slow processing for specific domains.",
          },
          {
            q: "Should I delete or suppress invalid email addresses?",
            a: "Hard invalid addresses should be permanently removed — they will never result in successful delivery. Catch-all addresses can be suppressed from cold outreach but retained for transactional notifications. Unknown addresses can be kept but monitored — suppress them if they show no engagement over 3-6 months. Create a suppression list from removed addresses to prevent re-importing them in future campaigns.",
          },
          {
            q: "How often should I run bulk validation?",
            a: "Active marketing lists should be validated at minimum quarterly. High-frequency senders benefit from monthly validation. Validation is especially important before importing contacts from new sources, after extended periods of inactivity, or before critical campaign launches. Setting up real-time validation at the point of email capture reduces how often bulk validation is needed, since new additions always enter the list clean.",
          },
          {
            q: "Can bulk validation improve my email deliverability?",
            a: "Yes — list hygiene is one of the most impactful deliverability improvements available. If you experience bounce rates above 2%, bulk validation should be your first action. After cleaning, gradually re-warm your sending reputation by starting with your most engaged subscribers. ISPs track historical sending behavior, so improvements in bounce rates and engagement metrics typically take 2-4 weeks to fully reflect in inbox placement rates.",
          },
        ]}
      />
      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        toolName="Bulk Email Checker"
      />
    </>
  );
}
