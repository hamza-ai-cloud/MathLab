'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Send,
  Mail,
  User,
  MessageSquare,
  MapPin,
  Clock,
  Globe,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'hello@mathlab.ai',
    description: 'We reply within 24 hours',
    gradient: 'from-electric to-violet',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Lahore, Pakistan',
    description: 'Building from the heart of Punjab',
    gradient: 'from-violet to-neon-pink',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    value: 'Mon - Sat, 9AM - 6PM',
    description: 'PKT (UTC+5)',
    gradient: 'from-neon-cyan to-electric',
  },
  {
    icon: Globe,
    title: 'Social',
    value: '@mathlabai',
    description: 'Twitter, LinkedIn, Instagram',
    gradient: 'from-neon-green to-neon-cyan',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true } as const,
};

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen bg-deep relative">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="mesh-gradient" />
          <div className="absolute inset-0 grid-paper opacity-10" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-electric/8 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-violet/8 blur-[120px]" />

          <div className="relative container mx-auto max-w-4xl text-center">
            <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 border border-neon-cyan/20 mb-8">
                <MessageSquare size={14} className="text-neon-cyan" />
                <span className="text-sm text-slate-300">Get in Touch</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
                Let&apos;s{' '}
                <span className="text-gradient">Connect</span>
              </h1>

              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Have questions, feedback, or partnership ideas? We&apos;d love
                to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <section className="relative px-4 pb-24 -mt-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-5 gap-10">
              {/* Form — 3 cols */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3"
              >
                <div className="glass-card rounded-3xl border border-white/10 shadow-depth p-8 md:p-10">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Send a Message
                  </h2>
                  <p className="text-sm text-slate-400 mb-8">
                    Fill in the form below and we&apos;ll get back to you as soon as
                    possible.
                  </p>

                  <AnimatePresence mode="wait">
                    {sent ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-16"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 200,
                            delay: 0.1,
                          }}
                          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan shadow-glow mb-6"
                        >
                          <CheckCircle size={36} className="text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-slate-400 mb-8">
                          Thanks for reaching out. We&apos;ll reply within 24
                          hours.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSent(false)}
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                      >
                        <div className="grid sm:grid-cols-2 gap-5">
                          <Input
                            label="Your Name"
                            placeholder="Muhammad Ali"
                            icon={<User size={16} />}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                          <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail size={16} />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        {/* Textarea */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Message
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-3.5 text-slate-400">
                              <MessageSquare size={16} />
                            </div>
                            <textarea
                              rows={5}
                              placeholder="Tell us what's on your mind..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              required
                              className="w-full pl-10 pr-4 py-3 glass-input rounded-xl text-white placeholder-slate-500 focus:outline-none resize-none"
                            />
                          </div>
                        </div>

                        <motion.div whileHover="hover" className="pt-2">
                          <Button
                            type="submit"
                            variant="glow"
                            size="lg"
                            shimmer
                            className="w-full sm:w-auto gap-2"
                          >
                            <Send size={16} />
                            Send Message
                            <motion.span
                              className="inline-flex"
                              variants={{ hover: { x: 5 } }}
                              transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 15,
                              }}
                            >
                              <ArrowRight size={16} />
                            </motion.span>
                          </Button>
                        </motion.div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Info cards — 2 cols */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 space-y-5"
              >
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{
                        scale: 1.03,
                        rotateY: 3,
                        rotateX: -2,
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="glass-card rounded-2xl p-5 border border-white/5 hover:border-electric/20 transition-all"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-glow shrink-0`}
                        >
                          <Icon size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                            {info.title}
                          </p>
                          <p className="text-white font-semibold">
                            {info.value}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* FAQ teaser */}
                <div className="glass-card rounded-2xl p-6 border border-white/5 text-center">
                  <Sparkles
                    size={24}
                    className="text-electric-light mx-auto mb-3"
                  />
                  <p className="text-white font-semibold mb-1">
                    Need quick answers?
                  </p>
                  <p className="text-sm text-slate-400 mb-4">
                    Check our FAQ for common questions
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 text-sm text-electric-light font-medium hover:text-white transition"
                  >
                    View FAQ
                    <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
