import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { dimensions: 24, text: 'text-base', src: '/favicon-16x16.png' },
    md: { dimensions: 32, text: 'text-xl', src: '/favicon-32x32.png' },
    lg: { dimensions: 48, text: 'text-3xl', src: '/android-chrome-192x192.png' },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="group-hover:scale-110 transition-transform">
        <Image
          src={sizeConfig.src}
          alt="Sugesto Logo"
          width={sizeConfig.dimensions}
          height={sizeConfig.dimensions}
          priority
        />
      </div>
      {showText && (
        <span
          className={`font-bold ${sizeConfig.text} bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}
        >
          Sugesto
        </span>
      )}
    </div>
  );
}
