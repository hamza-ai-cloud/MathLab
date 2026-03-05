'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Calculator,
  Sigma,
  Brain,
  Lightbulb,
  BarChart3,
} from 'lucide-react';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Algebra', value: 'algebra' },
  { label: 'Calculus', value: 'calculus' },
  { label: 'Geometry', value: 'geometry' },
  { label: 'Tips & Tricks', value: 'tips' },
];

const posts = [
  {
    title: 'How to Solve Calculus Problems Fast',
    excerpt:
      'Master the art of differentiation and integration with these proven shortcuts that top students use.',
    category: 'Calculus',
    readTime: '5 min',
    icon: TrendingUp,
    gradient: 'from-electric to-violet',
    featured: true,
  },
  {
    title: '10 Algebra Tricks Every Student Should Know',
    excerpt:
      'From factoring to quadratic shortcuts — learn the techniques that make algebra feel effortless.',
    category: 'Algebra',
    readTime: '4 min',
    icon: Calculator,
    gradient: 'from-violet to-neon-pink',
    featured: false,
  },
  {
    title: 'Understanding Limits: A Visual Guide',
    excerpt:
      'Limits don\'t have to be confusing. See how approaching a value works with interactive examples.',
    category: 'Calculus',
    readTime: '7 min',
    icon: Sigma,
    gradient: 'from-neon-cyan to-electric',
    featured: false,
  },
  {
    title: 'The Beauty of the Pythagorean Theorem',
    excerpt:
      'Beyond a² + b² = c². Explore the surprising real-world applications and elegant proofs.',
    category: 'Geometry',
    readTime: '6 min',
    icon: Lightbulb,
    gradient: 'from-neon-orange to-neon-pink',
    featured: false,
  },
  {
    title: 'AI in Education: How MathLab Helps You Learn',
    excerpt:
      'Discover how AI-powered step-by-step solutions build real mathematical understanding.',
    category: 'Tips & Tricks',
    readTime: '3 min',
    icon: Brain,
    gradient: 'from-neon-green to-neon-cyan',
    featured: false,
  },
  {
    title: 'Mastering Integration by Parts',
    excerpt:
      'The LIATE rule, tabular method, and practice problems to make integration second nature.',
    category: 'Calculus',
    readTime: '8 min',
    icon: BarChart3,
    gradient: 'from-electric to-neon-cyan',
    featured: false,
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
};

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-deep relative">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="mesh-gradient" />
          <div className="absolute inset-0 grid-paper opacity-10" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-electric/8 blur-[120px]" />

          <div className="relative container mx-auto max-w-4xl text-center">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 border border-violet/20 mb-8">
                <BookOpen size={14} className="text-violet-light" />
                <span className="text-sm text-slate-300">Math Blog</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Tips, Tricks &{' '}
                <span className="text-gradient">Tutorials</span>
              </h1>

              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Level up your math skills with guides written by students and
                educators. Updated weekly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category pills */}
        <section className="relative px-4 -mt-4 mb-12">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.value}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    i === 0
                      ? 'bg-gradient-to-r from-electric to-violet text-white shadow-glow'
                      : 'glass text-slate-400 border border-white/5 hover:border-electric/20 hover:text-white'
                  }`}
                >
                  {cat.label}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured post */}
        <section className="relative px-4 mb-12">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.01, rotateY: 1, rotateX: -1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="glass-card rounded-3xl border border-white/10 hover:border-electric/20 overflow-hidden shadow-depth"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image placeholder */}
                  <div className="relative h-64 md:h-auto bg-gradient-to-br from-electric/10 to-violet/10 overflow-hidden">
                    <div className="absolute inset-0 grid-paper opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-electric to-violet flex items-center justify-center shadow-glow"
                      >
                        <TrendingUp size={40} className="text-white" />
                      </motion.div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-electric/20 border border-electric/30 text-electric-light text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full glass text-xs text-violet-light border border-violet/20">
                        {posts[0].category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} />
                        {posts[0].readTime} read
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      {posts[0].title}
                    </h2>

                    <p className="text-slate-400 leading-relaxed mb-6">
                      {posts[0].excerpt}
                    </p>

                    <motion.div whileHover="hover" className="inline-flex">
                      <Link
                        href="#"
                        className="inline-flex items-center gap-2 text-electric-light font-semibold text-sm hover:text-white transition-colors"
                      >
                        Read Article
                        <motion.span
                          variants={{ hover: { x: 4 } }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <ArrowRight size={14} />
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Posts grid */}
        <section className="relative px-4 pb-24">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post, index) => {
                const Icon = post.icon;
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
                      className="glass-card rounded-2xl border border-white/5 hover:border-electric/20 overflow-hidden h-full flex flex-col"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Card image area */}
                      <div className="relative h-40 bg-gradient-to-br from-deep-50 to-deep overflow-hidden">
                        <div className="absolute inset-0 grid-paper opacity-15" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${post.gradient} flex items-center justify-center shadow-glow`}
                          >
                            <Icon size={24} className="text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2.5 py-0.5 rounded-full glass text-[11px] text-slate-300 border border-white/10">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock size={10} />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white mb-2">
                          {post.title}
                        </h3>

                        <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                          {post.excerpt}
                        </p>

                        <motion.div whileHover="hover" className="inline-flex">
                          <Link
                            href="#"
                            className="inline-flex items-center gap-1.5 text-electric-light text-sm font-medium hover:text-white transition-colors"
                          >
                            Read more
                            <motion.span
                              variants={{ hover: { x: 3 } }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <ArrowRight size={13} />
                            </motion.span>
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Load more */}
          <div className="text-center mt-12">
            <motion.div whileHover="hover">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl glass border border-white/10 hover:border-electric/20 text-slate-300 hover:text-white font-medium transition-all"
              >
                <Sparkles size={16} />
                Load More Articles
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
