import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { box: 'w-6 h-6', icon: 'w-4 h-4', text: 'text-base' },
    md: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-xl' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-3xl' },
  };

  const sizeClasses = sizes[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${sizeClasses.box} bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
      >
        <Sparkles className={`${sizeClasses.icon} text-white`} />
      </div>
      {showText && (
        <span
          className={`font-bold ${sizeClasses.text} bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}
        >
          Sugesto
        </span>
      )}
    </div>
  );
}
