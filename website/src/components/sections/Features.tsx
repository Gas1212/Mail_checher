'use client';

import { motion } from 'framer-motion';
import { Check, Mail, Zap, Shield, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function Features() {
  const features = [
    {
      icon: Check,
      title: 'Syntax Validation',
      description: 'Instantly verify email format and structure compliance with RFC standards.',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Globe,
      title: 'DNS Verification',
      description: 'Check domain existence and MX records to ensure the domain can receive emails.',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Mail,
      title: 'SMTP Testing',
      description: 'Verify if the mailbox actually exists by connecting to the mail server.',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Disposable Detection',
      description: 'Identify temporary and disposable email addresses to prevent spam.',
      color: 'from-orange-400 to-red-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
            Powerful Email Validation
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Comprehensive checks to ensure email quality and deliverability
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card hover className="h-full">
                  <CardContent className="text-center p-4 sm:p-6">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-6 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
