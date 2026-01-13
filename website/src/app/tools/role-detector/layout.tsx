import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Role Account Detector - Identify Generic vs Personal Email Addresses',
  description: 'Free role-based email detector. Identify whether an email is a generic organizational account (info@, support@) or a personal account. Improve targeting. Try 3 times for free.',
  keywords: ['role account detector', 'role-based email', 'generic email detector', 'personal email identifier', 'email account type', 'email targeting'],
  openGraph: {
    title: 'Role Account Detector - Sugesto',
    description: 'Identify generic role-based email accounts vs personal accounts. Improve email targeting.',
    url: 'https://sugesto.xyz/tools/role-detector',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Role Account Detector - Sugesto',
    description: 'Identify whether emails are role-based or personal accounts.',
  },
  alternates: {
    canonical: 'https://sugesto.xyz/tools/role-detector',
  },
};

export default function RoleDetectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
