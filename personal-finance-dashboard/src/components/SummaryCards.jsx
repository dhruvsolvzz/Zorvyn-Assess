import { FiArrowDownRight, FiArrowUpRight, FiDollarSign } from 'react-icons/fi';
import { CurrencyDisplay } from './ui/CurrencyDisplay';
import { useStore } from '../store/useStore';
import { Card, CardContent } from './ui/card';
import { BorderBeam } from './ui/border-beam';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkline } from './ui/Sparkline';
import { subDays, format, isSameDay, parseISO } from 'date-fns';

function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SummaryCards() {
  const transactions = useStore((state) => state.transactions);

  const getTrendData = (type) => {
    const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    return days.map(day => {
      return transactions
        .filter(t => (type === 'Balance' ? true : t.type === type) && isSameDay(parseISO(t.date), day))
        .reduce((sum, t) => {
          if (type === 'Balance') {
            return sum + (t.type === 'Income' ? t.amount : -t.amount);
          }
          return sum + t.amount;
        }, 0);
    });
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const stats = [
    {
      title: 'Total Balance',
      value: balance,
      icon: FiDollarSign,
      color: '#818CF8',
      trend: getTrendData('Balance'),
      description: 'Available liquid assets',
    },
    {
      title: 'Total Income',
      value: totalIncome,
      icon: FiArrowUpRight,
      color: '#10B981',
      trend: getTrendData('Income'),
      description: 'Combined monthly revenue',
    },
    {
      title: 'Total Expenses',
      value: totalExpense,
      icon: FiArrowDownRight,
      color: '#F43F5E',
      trend: getTrendData('Expense'),
      description: 'Scheduled & ad-hoc costs',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 perspective-[1000px]">
      {stats.map((stat) => (
        <TiltCard key={stat.title} className="relative h-full">
          <Card className="h-full border-border/40 bg-card/40 backdrop-blur-md overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <BorderBeam
              duration={8}
              size={150}
              colorFrom={stat.color}
              colorTo={stat.color}
              opacity={0.5}
            />
            
            <CardContent className="p-6 relative">
              <div className="flex flex-col gap-6">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div 
                        className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full animate-pulse"
                        style={{ backgroundColor: stat.color }}
                      />
                      <div 
                        className="p-2.5 rounded-xl border border-white/5 relative bg-white/5 backdrop-blur-sm"
                        style={{ color: stat.color }}
                      >
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                      {stat.title}
                    </span>
                  </div>
                  
                  <Sparkline 
                    data={stat.trend} 
                    color={stat.color} 
                    width={80} 
                    height={30} 
                  />
                </div>

                {/* Value Row */}
                <div className="space-y-1">
                  <CurrencyDisplay 
                    amount={stat.value} 
                    size="2xl"
                    className="text-4xl"
                    style={{ color: stat.title === 'Total Balance' ? 'inherit' : stat.color }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary/40 animate-ping" />
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {stat.description}
                    </p>
                  </div>
                </div>

                {/* Decorative Watermark */}
                <stat.icon className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </TiltCard>
      ))}
    </div>
  );
}

