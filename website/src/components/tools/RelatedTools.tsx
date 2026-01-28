import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface RelatedTool {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
  title?: string;
}

export default function RelatedTools({ tools, title = 'Related Tools' }: RelatedToolsProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {title}
        </h3>
        <div className={`grid grid-cols-1 ${tools.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.name} href={tool.href}>
                <Card hover className="h-full group cursor-pointer">
                  <CardContent className="text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
