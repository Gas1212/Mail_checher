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
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Email Validation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive checks to ensure email quality and deliverability
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card hover className="h-full">
                  <CardContent className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
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
