import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useStore } from '../store/useStore';
import { useTheme } from 'next-themes';
import { parseISO, format, compareAsc } from 'date-fns';

const PIE_COLORS = ['#8B93F0', '#5EDDB5', '#E4B060', '#E8788A', '#A78BF0', '#5EC7D4'];

export function Charts() {
  const transactions = useStore((state) => state.transactions);
  const { resolvedTheme } = useTheme();

  const css = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const isDark = resolvedTheme === 'dark';
  const textColor = css?.getPropertyValue('--muted-foreground').trim() || (isDark ? '#94a3b8' : '#64748b');
  const gridColor = css?.getPropertyValue('--border').trim() || (isDark ? '#334155' : '#e2e8f0');
  const tooltipBg = css?.getPropertyValue('--card').trim() || (isDark ? '#1e293b' : '#ffffff');
  const tooltipText = css?.getPropertyValue('--foreground').trim() || (isDark ? '#f8fafc' : '#0f172a');

  const trendData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));

    let currentBalance = 0;
    const dailyBalance = {};

    sorted.forEach((t) => {
      const dateKey = format(parseISO(t.date), 'MMM dd');
      if (t.type === 'Income') currentBalance += t.amount;
      else currentBalance -= t.amount;

      dailyBalance[dateKey] = currentBalance;
    });

    return Object.entries(dailyBalance).map(([date, balance]) => ({
      date,
      balance,
    }));
  }, [transactions]);

  const pieData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'Expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="card p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Balance Trend</h3>
        <div className="h-[300px] w-full text-xs md:text-sm">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B93F0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8B93F0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: textColor }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: textColor }}
                  tickFormatter={(val) => `$${val}`}
                  dx={-10}
                  width={65}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: gridColor,
                    borderRadius: '8px',
                    color: tooltipText,
                  }}
                  itemStyle={{ color: '#8B93F0', fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#8B93F0"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </div>

      <div className="card p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Expense Breakdown</h3>
        <div className="h-[300px] w-full text-xs md:text-sm">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${value}`}
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: gridColor,
                    borderRadius: '8px',
                    color: tooltipText,
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span style={{ color: textColor }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No expense data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

