import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const data = [
  { time: '09:30', value: 12450.00 },
  { time: '10:00', value: 12510.50 },
  { time: '10:30', value: 12480.20 },
  { time: '11:00', value: 12620.80 },
  { time: '11:30', value: 12590.10 },
  { time: '12:00', value: 12750.30 },
  { time: '12:30', value: 12810.00 },
  { time: '13:00', value: 12780.50 },
  { time: '13:30', value: 12890.20 },
  { time: '14:00', value: 13010.40 },
  { time: '14:30', value: 12950.80 },
  { time: '15:00', value: 13120.60 },
  { time: '15:30', value: 13245.80 },
];

export function PortfolioChart() {
  return (
    <div className="glass-card p-6 col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Portfolio Performance</h2>
          <p className="text-sm text-slate-400">Total value over the trading session</p>
        </div>
        <div className="flex gap-2">
          {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
            <button 
              key={tf}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tf === '1D' 
                  ? 'bg-primary-500/20 text-primary-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass p-3 rounded-xl border border-white/10 shadow-xl">
                      <p className="text-sm text-slate-400 mb-1">{payload[0].payload.time}</p>
                      <p className="text-lg font-bold text-white">
                        ${payload[0].value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#14b8a6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
