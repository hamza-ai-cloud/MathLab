'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import {
  Zap,
  ImageIcon,
  BookOpen,
  Layers,
  Globe,
  Shield,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Solutions',
      description:
        'Get accurate step-by-step solutions in under 3 seconds using our AI engine.',
      gradient: 'from-electric to-electric-dark',
      glow: 'shadow-glow',
    },
    {
      icon: ImageIcon,
      title: 'OCR Recognition',
      description:
        'Upload handwritten problems — our AI reads and solves them automatically.',
      gradient: 'from-violet to-violet-dark',
      glow: 'shadow-glow-violet',
    },
    {
      icon: BookOpen,
      title: 'Learn & Improve',
      description:
        'Understand every step with clear explanations and concept breakdowns.',
      gradient: 'from-neon-cyan to-electric',
      glow: 'shadow-glow',
    },
    {
      icon: Layers,
      title: 'Multi-Step Solver',
      description:
        'From algebra to calculus — handles complex multi-step problems effortlessly.',
      gradient: 'from-neon-pink to-violet',
      glow: 'shadow-glow-violet',
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description:
        'Available in English, Urdu, and 4+ more languages for global students.',
      gradient: 'from-neon-orange to-neon-pink',
      glow: 'shadow-glow',
    },
    {
      icon: Shield,
      title: 'Freemium Plan',
      description:
        'Start free with 10 problems/day. Upgrade for unlimited access.',
      gradient: 'from-neon-green to-neon-cyan',
      glow: 'shadow-glow',
    },
  ];

  return (
    <section id="features" className="relative py-28 px-4">
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-50/50 to-transparent" />

      <div className="relative container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-electric-light text-sm font-semibold uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Built for students, by engineers. Every feature designed
            to make math effortless.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                hover
                glow="blue"
                delay={index * 0.1}
              >
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotateY: 15 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center ${feature.glow}`}
                  >
                    <Icon size={22} className="text-white" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
