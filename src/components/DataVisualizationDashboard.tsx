import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Activity } from "lucide-react";

// 7-day trend data for Sovereign Wealth Fund Capital Flows (SAGA-PEZ, EpsLGSEz & Anchor LPs)
interface FlowDatum {
  date: string;
  inflow: number;
  outflow: number;
  net: number;
}

const INITIAL_FLOW_DATA: FlowDatum[] = [
  { date: "26. May", inflow: 4041.2, outflow: 3950.4, net: 90.8 },
  { date: "27. May", inflow: 4043.5, outflow: 3951.0, net: 92.5 },
  { date: "28. May", inflow: 4046.1, outflow: 3952.1, net: 94.0 },
  { date: "29. May", inflow: 4048.9, outflow: 3952.8, net: 96.1 },
  { date: "30. May", inflow: 4049.5, outflow: 3953.5, net: 96.0 },
  { date: "31. May", inflow: 4050.8, outflow: 3954.2, net: 96.6 },
  { date: "01. Jun", inflow: 4051.6, outflow: 3954.9, net: 96.7 },
];

export function DataVisualizationDashboard() {
  const [hoveredData, setHoveredData] = useState<FlowDatum | null>(null);

  // Formatting for currency
  const formatValue = (val: number) => {
    return `€ ${val.toFixed(1)}B`;
  };

  return (
    <div className="w-full bg-black/90 border border-amber-500/30 rounded-lg p-4 font-mono select-none" id="swf-data-viz-dashboard">
      <div className="flex items-center justify-between mb-3 border-b border-amber-900/30 pb-2">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-[10px] uppercase font-bold text-[#fcf6ba] tracking-wider">
            SWF 7-Day Capital Flow Index (CNP Node)
          </span>
        </div>
        <div className="flex items-center gap-1 bg-amber-950/40 border border-[#bf953f]/30 px-1.5 py-0.5 rounded text-[8px] text-[#fcf6ba]">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>+0.26% WEEKLY</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 border border-zinc-800 bg-zinc-950/60 rounded">
          <span className="text-[7.5px] text-gray-500 uppercase block tracking-wider">Gross Inflow Asset Base</span>
          <span className="text-xs font-black text-white block mt-0.5">€ 4,051.6B</span>
        </div>
        <div className="p-2 border border-zinc-800 bg-zinc-950/60 rounded">
          <span className="text-[7.5px] text-gray-500 uppercase block tracking-wider">Net Liquidity Buffer</span>
          <span className="text-xs font-black text-amber-300 block mt-0.5">€ 96.7B</span>
        </div>
      </div>

      {/* Recharts Area Chart container */}
      <div className="h-40 w-full relative mb-1" style={{ minWidth: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={INITIAL_FLOW_DATA}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            onMouseMove={(state) => {
              const mouseState = state as unknown as {
                activePayload?: Array<{ payload: FlowDatum }>;
              };
              if (mouseState?.activePayload) {
                setHoveredData(mouseState.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredData(null)}
          >
            <defs>
              <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#bf953f" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#bf953f" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis
              dataKey="date"
              stroke="#555"
              fontSize={7}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#555"
              fontSize={7}
              domain={["dataMin - 1", "dataMax + 1"]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v.toFixed(0)}B`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-black border border-amber-500/80 p-2 rounded text-[8px] leading-relaxed shadow-xl max-w-[140px] pointer-events-none">
                      <p className="font-bold text-[#fcf6ba] uppercase mb-0.5">{data.date}</p>
                      <p className="text-white">Gross: <span className="font-bold">{formatValue(data.inflow)}</span></p>
                      <p className="text-amber-400">Net: <span className="font-bold">{formatValue(data.net)}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="inflow"
              stroke="#bf953f"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorInflow)"
            />
            <Area
              type="monotone"
              dataKey="net"
              stroke="#00ffff"
              strokeWidth={1}
              fillOpacity={1}
              fill="url(#colorNet)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[7px] text-gray-500 px-1 border-t border-zinc-800/60 pt-1.5">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#bf953f] rounded-full inline-block" /> Gross Flow
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#00ffff] rounded-full inline-block" /> Net Reserves
        </span>
        <span className="text-right text-[7.5px] text-[#fcf6ba] uppercase animate-pulse">
          {hoveredData ? `Selected: ${hoveredData.date}` : "Live Feed Oracle"}
        </span>
      </div>
    </div>
  );
}
