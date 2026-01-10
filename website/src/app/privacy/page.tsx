import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Sugesto',
  description: 'Privacy Policy for Sugesto email validation and SEO tools',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sugesto
            </h1>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 7, 2026</p>

          <div className="prose prose-indigo max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to Sugesto. We respect your privacy and are committed to protecting your personal data. This
                privacy policy will inform you about how we look after your personal data when you visit our website
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Identity Data</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>First name and last name</li>
                <li>Email address</li>
                <li>Profile picture (if provided through Google OAuth)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Technical Data</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Time zone setting and location</li>
                <li>Browser plug-in types and versions</li>
                <li>Operating system and platform</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Information about how you use our website and services</li>
                <li>Email addresses you validate</li>
                <li>Validation results and history</li>
                <li>Tool usage statistics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use your personal data for the following purposes:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>To register you as a new user</li>
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To send you marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Legal Basis for Processing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                data in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you</li>
                <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests</li>
                <li>Where we need to comply with a legal obligation</li>
                <li>Where you have given us consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal data. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Service providers who help us operate our business (e.g., hosting providers, analytics services)</li>
                <li>Professional advisers including lawyers, bankers, auditors and insurers</li>
                <li>Government authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use the following third-party services:</p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Google OAuth</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use Google OAuth for authentication. When you sign in with Google, we receive your basic profile
                information (name, email, profile picture) as per Google&apos;s privacy policy.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Google Analytics</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use Google Analytics to understand how visitors use our site. Google Analytics collects information
                anonymously and reports website trends without identifying individual visitors.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Google Tag Manager</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use Google Tag Manager to manage website tags and tracking codes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We have put in place appropriate security measures to prevent your personal data from being
                accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We use:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure password hashing</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it
                for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you delete your account, we will delete or anonymize your personal data within 30 days, except
                where we are required to retain it for legal purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Under data protection laws, you have rights including:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Right to access</strong> - You can request copies of your personal data</li>
                <li><strong>Right to rectification</strong> - You can request that we correct inaccurate data</li>
                <li><strong>Right to erasure</strong> - You can request that we delete your personal data</li>
                <li><strong>Right to restrict processing</strong> - You can request that we limit how we use your data</li>
                <li><strong>Right to data portability</strong> - You can request a copy of your data in a common format</li>
                <li><strong>Right to object</strong> - You can object to certain types of processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Cookies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our service and hold certain
                information. Cookies are files with small amounts of data which may include an anonymous unique
                identifier.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
                if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our service is not intended for use by children under the age of 13. We do not knowingly collect
                personally identifiable information from children under 13. If you become aware that a child has
                provided us with personal data, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or want to exercise your rights, please contact us:
              </p>
              <p className="text-gray-700 leading-relaxed">
                Email: <a href="mailto:privacy@sugesto.xyz" className="text-indigo-600 hover:text-indigo-700">privacy@sugesto.xyz</a>
              </p>
            </section>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to sign up
          </Link>
        </div>
      </main>
    </div>
  );
}
