import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTA_PARTICLES = Array.from({ length: 15 }).map(() => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  duration: 3 + Math.random() * 2,
  delay: Math.random() * 2,
}));

export default function CTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section ref={containerRef} className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        style={{ scale: backgroundScale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-dark-bg to-cyan-900/50" />

        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(108, 99, 255, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(108, 99, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {CTA_PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Join 500,000+ Happy Users</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Experience{' '}
              <span className="text-gradient">More?</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 max-w-lg">
              Our mobile app is coming soon! Stay tuned for exclusive deals,
              early access to tickets, and personalized recommendations right in your pocket.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8 py-6 text-lg font-semibold rounded-full animate-pulse-glow"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                disabled
                className="border-white/20 text-white/50 cursor-not-allowed hover:bg-transparent px-8 py-6 text-lg rounded-full"
              >
                <Download className="mr-2 w-5 h-5" />
                Mobile App Coming Soon
              </Button>
            </div>


          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative mx-auto w-[300px]">
              {/* Phone Frame */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative bg-dark-100 rounded-[3rem] p-3 border border-white/10 shadow-2xl"
              >
                {/* Screen */}
                <div className="bg-dark-bg rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                  {/* Mock App UI */}
                  <div className="p-4 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
                      <div className="w-6 h-6 rounded-full bg-white/10" />
                    </div>

                    {/* Search */}
                    <div className="h-10 bg-white/5 rounded-xl mb-4" />

                    {/* Categories */}
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30" />
                      ))}
                    </div>

                    {/* Event Cards */}
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 rounded-xl bg-white/5 flex gap-3 p-3">
                          <div className="w-16 h-full rounded-lg bg-gradient-to-br from-purple-500/50 to-cyan-500/50" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-white/10 rounded" />
                            <div className="h-3 w-1/2 bg-white/5 rounded" />
                            <div className="h-3 w-1/3 bg-white/5 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-dark-100 rounded-full" />
              </motion.div>

              {/* Glow Effect */}
              <div className="absolute -inset-10 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full blur-[60px] -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
