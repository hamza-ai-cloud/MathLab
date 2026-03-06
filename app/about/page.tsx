'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Brain,
  Target,
  Heart,
  Lightbulb,
  Users,
  GraduationCap,
  Globe,
  Rocket,
  Award,
  BookOpen,
} from 'lucide-react';

const timeline = [
  {
    year: '2024',
    title: 'The Spark',
    description:
      'A group of engineering students realized math education was broken. Students were copying answers, not understanding concepts.',
    icon: Lightbulb,
    color: 'electric',
  },
  {
    year: '2024',
    title: 'Building MathLab',
    description:
      'We combined cutting-edge AI with pedagogical principles to create a solver that teaches, not just solves.',
    icon: Rocket,
    color: 'violet',
  },
  {
    year: '2025',
    title: 'OCR & Multi-Language',
    description:
      'Added handwriting recognition and support for Urdu, Hindi, Arabic — making math accessible to millions.',
    icon: Globe,
    color: 'neon-cyan',
  },
  {
    year: '2026',
    title: 'Today & Beyond',
    description:
      'Serving 50,000+ students worldwide with step-by-step solutions that build real understanding.',
    icon: Award,
    color: 'neon-green',
  },
];

const values = [
  {
    icon: Target,
    title: 'Understanding First',
    description:
      'Every solution includes clear explanations. We want you to learn, not just copy.',
    gradient: 'from-electric to-electric-dark',
  },
  {
    icon: Heart,
    title: 'Student-Centric',
    description:
      'Built by students, for students. We know the struggles of late-night math homework.',
    gradient: 'from-violet to-violet-dark',
  },
  {
    icon: Users,
    title: 'Accessible to All',
    description:
      'Free tier with 10 problems/day. Multi-language support for global reach.',
    gradient: 'from-neon-cyan to-electric',
  },
  {
    icon: GraduationCap,
    title: 'Concept Badges',
    description:
      'Each step is tagged with the mathematical concept used, in English and Urdu.',
    gradient: 'from-neon-pink to-violet',
  },
  {
    icon: BookOpen,
    title: 'Step-by-Step',
    description:
      'Not just the answer — every intermediate step explained with why it matters.',
    gradient: 'from-neon-orange to-neon-pink',
  },
  {
    icon: Brain,
    title: 'AI-Powered',
    description:
      'Powered by MathLab AI for accurate, context-aware mathematical reasoning.',
    gradient: 'from-neon-green to-neon-cyan',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-deep relative">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-28 px-4 overflow-hidden">
          <div className="mesh-gradient" />
          <div className="absolute inset-0 grid-paper opacity-10" />

          {/* Glow orbs */}
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-electric/8 blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-violet/8 blur-[120px]" />

          <div className="relative container mx-auto max-w-4xl text-center">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 border border-electric/20 mb-8">
                <Brain size={14} className="text-electric-light" />
                <span className="text-sm text-slate-300">Our Story</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                Math Should Be{' '}
                <span className="text-gradient">Understood</span>
                <br />
                Not Just Solved
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                MathLab isn&apos;t another calculator. It&apos;s a learning
                companion that breaks down complex math into human-readable
                steps — so you actually{' '}
                <span className="text-white font-medium">get it</span>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="relative py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
              <p className="text-electric-light text-sm font-semibold uppercase tracking-wider mb-3">
                Journey
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Our Timeline
              </h2>
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-electric/50 via-violet/50 to-transparent hidden md:block" />

              <div className="space-y-16">
                {timeline.map((item, index) => {
                  const Icon = item.icon;
                  const isLeft = index % 2 === 0;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`relative flex flex-col md:flex-row items-center gap-8 ${
                        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Content */}
                      <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                        <div
                          className={`glass-card rounded-2xl p-6 border border-white/10 hover:border-${item.color}/30 transition-all`}
                        >
                          <span className="text-xs font-bold text-electric-light uppercase tracking-wider">
                            {item.year}
                          </span>
                          <h3 className="text-xl font-bold text-white mt-2 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Center dot */}
                      <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow shrink-0">
                        <Icon size={22} className="text-white" />
                      </div>

                      {/* Spacer */}
                      <div className="flex-1 hidden md:block" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative py-24 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-50/50 to-transparent" />
          <div className="relative container mx-auto max-w-6xl">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="text-center mb-16">
              <p className="text-violet-light text-sm font-semibold uppercase tracking-wider mb-3">
                What We Believe
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Our Core Values
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03, rotateY: 3, rotateX: -2 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="glass-card rounded-2xl p-6 border border-white/5 hover:border-electric/20 transition-all h-full"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotateY: 15 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-glow mb-4`}
                      >
                        <Icon size={22} className="text-white" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {value.description}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '50K+', label: 'Students', color: 'electric' },
                { value: '1M+', label: 'Problems Solved', color: 'violet' },
                { value: '6+', label: 'Languages', color: 'neon-cyan' },
                { value: '99%', label: 'Accuracy', color: 'neon-green' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6 text-center border border-white/5"
                >
                  <p className="text-3xl md:text-4xl font-black text-gradient mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
