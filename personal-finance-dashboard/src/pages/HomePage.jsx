import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiTrendingUp,
  FiPieChart,
  FiZap,
  FiLock,
  FiBarChart2,
  FiArrowRight,
  FiCheck,
  FiStar,
} from 'react-icons/fi';
import { DemoOne } from '../components/ui/demo';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

/* ─── Animation Variants ───────────────────────────── */

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 18 },
  },
};

/* ─── Data ─────────────────────────────────────────── */

const features = [
  {
    icon: FiTrendingUp,
    title: 'Real-Time Insights',
    description:
      'Watch your spending patterns evolve in real-time with intelligent trend analysis and predictive forecasting.',
    color: '#10B981',
  },
  {
    icon: FiPieChart,
    title: 'Smart Categorization',
    description:
      'Transactions auto-categorize using rule-based intelligence. No manual tagging — just clarity.',
    color: '#6366F1',
  },
  {
    icon: FiShield,
    title: 'Bank-Grade Security',
    description:
      'All data stays local in your browser with AES-256 encryption. Zero cloud storage, zero risk.',
    color: '#F59E0B',
  },
  {
    icon: FiZap,
    title: 'Blazing Performance',
    description:
      'Built on modern React with GSAP-powered animations. Sub-100ms interactions, buttery smooth UI.',
    color: '#EC4899',
  },
  {
    icon: FiLock,
    title: 'Role-Based Access',
    description:
      'Switch between Admin and Viewer modes instantly. Control who can create, edit, or delete transactions.',
    color: '#8B5CF6',
  },
  {
    icon: FiBarChart2,
    title: 'Visual Analytics',
    description:
      'Interactive charts, sparklines, and radial gauges bring your financial data to life at a glance.',
    color: '#06B6D4',
  },
];

const stats = [
  { value: '100%', label: 'Client-Side', sublabel: 'No servers needed' },
  { value: '<50ms', label: 'Response Time', sublabel: 'Instant interactions' },
  { value: '∞', label: 'Transactions', sublabel: 'No limits, ever' },
  { value: '0', label: 'Data Leaks', sublabel: 'By design' },
];

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Freelance Designer',
    quote: 'Finally a finance tool that respects my privacy. Everything runs locally, and the UI is gorgeous.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Startup Founder',
    quote: 'The role-based access is perfect for my team. Admin vs Viewer modes keep things clean and secure.',
    rating: 5,
  },
  {
    name: 'Jordan Ellis',
    role: 'Software Engineer',
    quote: 'The animations are insane. This doesn\'t feel like a finance app — it feels like a premium product.',
    rating: 5,
  },
];

/* ─── Component ────────────────────────────────────── */

export function HomePage() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      {/* ── Hero ─────────────────────────────────── */}
      <section id="hero">
        <DemoOne />
      </section>

      {/* ── Stats Bar ────────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="relative mt-8 mb-20"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-xl" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center space-y-1"
            >
              <p className="text-3xl md:text-4xl font-black tracking-tighter text-primary">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-foreground">{stat.label}</p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {stat.sublabel}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Features Grid ────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-24"
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-3">
            Capabilities
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Everything you need.{' '}
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            A feature-complete financial dashboard that runs entirely in your browser.
            No subscriptions, no data collection, no compromises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div key={feature.title} variants={scaleIn}>
              <Card className="group relative h-full border-border/30 bg-card/40 backdrop-blur-xl overflow-hidden hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <div className="p-7 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"
                        style={{ backgroundColor: feature.color }}
                      />
                      <div
                        className="relative p-3 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300"
                        style={{ color: feature.color }}
                      >
                        <feature.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg tracking-tight">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-[3.5rem]">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner gradient */}
                <div
                  className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 blur-2xl"
                  style={{ background: feature.color }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── How It Works ─────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-24"
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-accent mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Three steps to{' '}
            <span className="text-primary italic">financial clarity.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Add Transactions',
              description:
                'Log your income and expenses with our intuitive form. Categorize, tag, and date every entry.',
              gradient: 'from-violet-500/10 to-indigo-500/10',
            },
            {
              step: '02',
              title: 'Analyze Patterns',
              description:
                'Watch your dashboard light up with trend charts, category breakdowns, and financial health scores.',
              gradient: 'from-emerald-500/10 to-teal-500/10',
            },
            {
              step: '03',
              title: 'Take Control',
              description:
                'Use data-driven insights to optimize spending, grow savings, and hit your financial goals.',
              gradient: 'from-amber-500/10 to-orange-500/10',
            },
          ].map((item) => (
            <motion.div key={item.step} variants={fadeUp}>
              <div
                className={`relative h-full p-8 rounded-2xl border border-border/30 bg-gradient-to-br ${item.gradient} backdrop-blur-xl group hover:scale-[1.02] transition-all duration-300`}
              >
                <span className="text-7xl font-black text-primary/10 absolute top-4 right-6 group-hover:text-primary/20 transition-colors duration-500 select-none">
                  {item.step}
                </span>
                <div className="relative space-y-3 pt-2">
                  <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Testimonials ─────────────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-24"
      >
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Loved by{' '}
            <span className="text-muted-foreground">real users.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={scaleIn}>
              <Card className="h-full border-border/30 bg-card/40 backdrop-blur-xl p-7 space-y-5 hover:border-primary/20 transition-all duration-300">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-sm font-black text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {t.role}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Pricing / Why Free ───────────────────── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="mb-24"
      >
        <motion.div variants={fadeUp}>
          <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-gradient-to-br from-primary/5 via-card/80 to-accent/5 backdrop-blur-xl p-10 md:p-16">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                  <FiZap className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">
                    Forever Free
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                  No subscription.
                  <br />
                  <span className="text-primary">No catch.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Smart Finance runs 100% in your browser. There are no servers to
                  maintain, no data to store, no costs to pass on to you.
                  It's open, transparent, and yours forever.
                </p>
                <Button
                  size="lg"
                  className="gap-2 group transition-all hover:scale-105 active:scale-95 mt-2"
                  onClick={() => navigate('/dashboard')}
                >
                  <span>Get Started Free</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  'Unlimited transactions',
                  'Real-time analytics & charts',
                  'Admin & Viewer roles',
                  'JSON export — your data, your way',
                  'Dark & Light mode',
                  'Works offline — no internet required',
                  'Zero tracking or telemetry',
                  'Responsive on all devices',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <FiCheck className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* ── Bottom CTA ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center py-16 mb-10"
      >
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
          Ready to take control?
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8">
          Your financial dashboard is one click away. No sign-up, no credit card,
          no strings attached.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            className="gap-2 group transition-all hover:scale-105 active:scale-95 px-10"
            onClick={() => navigate('/dashboard')}
          >
            <span>Launch Dashboard</span>
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 hover:scale-105 active:scale-95 transition-all px-10"
            onClick={() => navigate('/transactions')}
          >
            <span>View Transactions</span>
          </Button>
        </div>
      </motion.section>
    </PageTransition>
  );
}
