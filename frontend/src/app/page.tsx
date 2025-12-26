import EmailChecker from '@/components/EmailChecker';
import Stats from '@/components/Stats';
import History from '@/components/History';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto">
        <EmailChecker />
        <div className="mt-8">
          <Stats />
        </div>
        <div className="mt-8">
          <History />
        </div>
      </div>
    </main>
  );
}
