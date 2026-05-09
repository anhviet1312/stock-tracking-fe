import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchStockHistory } from '../../lib/api';
import { BarChart2 } from 'lucide-react';

interface CandlestickChartProps {
  symbol: string;
}

export function CandlestickChart({ symbol }: CandlestickChartProps) {
  const [series, setSeries] = useState<{ data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '6M' | '1Y'>('1M');

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      
      const to = Math.floor(Date.now() / 1000);
      let from = to - (30 * 24 * 60 * 60); // 1M default

      switch (timeframe) {
        case '1W': from = to - (7 * 24 * 60 * 60); break;
        case '1M': from = to - (30 * 24 * 60 * 60); break;
        case '3M': from = to - (90 * 24 * 60 * 60); break;
        case '6M': from = to - (180 * 24 * 60 * 60); break;
        case '1Y': from = to - (365 * 24 * 60 * 60); break;
      }

      try {
        const history = await fetchStockHistory(symbol, '1D', from, to);
        if (history && history.s === 'ok') {
          const chartData = history.t.map((timestamp, index) => {
            return {
              x: new Date(timestamp * 1000),
              y: [history.o[index], history.h[index], history.l[index], history.c[index]]
            };
          });
          setSeries([{ data: chartData }]);
        } else {
            setSeries([{ data: [] }]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [symbol, timeframe]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    theme: {
        mode: 'dark',
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#10b981', // emerald-500
          downward: '#f43f5e' // rose-500
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#94a3b8',
        }
      },
      axisBorder: {
        color: '#334155'
      },
      axisTicks: {
        color: '#334155'
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          colors: '#94a3b8',
        },
        formatter: (value) => value.toLocaleString()
      }
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.05)',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'dark',
    }
  };

  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          Price History
        </div>
        <div className="flex gap-2">
          {(['1W', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeframe === tf
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full flex items-center justify-center">
        {loading ? (
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        ) : series[0]?.data.length > 0 ? (
          <ReactApexChart options={options} series={series} type="candlestick" height={350} width="100%" />
        ) : (
          <div className="text-slate-500">No historical data available</div>
        )}
      </div>
    </div>
  );
}
