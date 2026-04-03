import { FiAlertCircle, FiTrendingUp, FiTrendingDown, FiPieChart, FiTarget } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { subMonths, isSameMonth, parseISO } from 'date-fns';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';

function RadialProgress({ percentage, color = '#9BA4F5' }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-muted/20"
        />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-black" style={{ color }}>
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export function InsightsPanel() {
  const transactions = useStore((state) => state.transactions);

  if (transactions.length === 0) return null;

  const expenseByCategory = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const highestCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];

  const now = new Date();
  const lastMonth = subMonths(now, 1);

  const thisMonthExpenses = transactions
    .filter((t) => t.type === 'Expense' && isSameMonth(parseISO(t.date), now))
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = transactions
    .filter((t) => t.type === 'Expense' && isSameMonth(parseISO(t.date), lastMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  let momText = 'Trend: Stable';
  let momTrend = null;
  let percentChange = 0;

  if (lastMonthExpenses > 0) {
    const diff = thisMonthExpenses - lastMonthExpenses;
    percentChange = (diff / lastMonthExpenses) * 100;
    if (diff > 0) {
      momText = `${percentChange.toFixed(0)}% Increase`;
      momTrend = 'up';
    } else {
      momText = `${Math.abs(percentChange).toFixed(0)}% Decrease`;
      momTrend = 'down';
    }
  }

  const totalIncome = transactions.filter((t) => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);

  const budgetUsageRaw = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
  const budgetUsage = Math.min(100, budgetUsageRaw);
  const isBudgetAlert = budgetUsage > 80;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8"
    >
      {/* Highest Expense */}
      {highestCategory && (
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="h-full border-border/30 bg-card/40 backdrop-blur-xl group hover:border-violet-500/30 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/8 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                  <FiPieChart className="w-6 h-6 text-violet-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    Highest Category
                  </p>
                  <p className="font-extrabold text-xl tracking-tight text-foreground">
                    {highestCategory[0]}
                    <span className="block text-xs font-semibold text-muted-foreground mt-0.5">
                      ${highestCategory[1].toLocaleString()} total
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
            <div className="absolute top-2 right-2 opacity-[0.03] italic text-6xl font-black group-hover:opacity-[0.07] transition-opacity">
              #1
            </div>
          </Card>
        </motion.div>
      )}

      {/* Spending Trend */}
      <motion.div variants={item} className="lg:col-span-4">
        <Card className="h-full border-border/30 bg-card/40 backdrop-blur-xl group hover:border-emerald-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ y: momTrend === 'up' ? -5 : 5 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  momTrend === 'up' ? 'bg-rose-500/8 text-rose-300' : 'bg-emerald-500/8 text-emerald-300'
                }`}
              >
                {momTrend === 'up' ? <FiTrendingUp className="w-6 h-6" /> : <FiTrendingDown className="w-6 h-6" />}
              </motion.div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  Monthly Momentum
                </p>
                <p className="font-extrabold text-xl tracking-tight text-foreground">{momText}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  {momTrend === 'up' ? 'Increase in burn rate' : 'Deflationary spending'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Health */}
      <motion.div variants={item} className="lg:col-span-4">
        <Card className={`h-full border-border/30 bg-card/40 backdrop-blur-xl group transition-all duration-300 ${
          isBudgetAlert ? 'hover:border-rose-500/30' : 'hover:border-primary/30'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <RadialProgress 
                  percentage={budgetUsage} 
                  color={isBudgetAlert ? '#E8788A' : '#9BA4F5'} 
                />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                   Health Index
                </p>
                <p className={`font-extrabold text-xl tracking-tight ${
                  isBudgetAlert ? 'text-rose-500 shadow-rose-500/20' : 'text-primary shadow-primary/20'
                }`}>
                  {isBudgetAlert ? 'High Burn' : 'Safe Spending'}
                </p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                   {isBudgetAlert ? 'Budget utilized > 80%' : 'Capital well-preserved'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

