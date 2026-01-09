import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { dimensions: 24, text: 'text-base' },
    md: { dimensions: 32, text: 'text-xl' },
    lg: { dimensions: 48, text: 'text-3xl' },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="group-hover:scale-110 transition-transform">
        <Image
          src="/favicon48.png"
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
