"use client";

import { useState, useEffect } from "react";
// Recharts 컴포넌트 임포트
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface PriceData {
  price: number;
  change: "RISE" | "FALL" | string;
  changePrice: number;
  timestamp: string;
}

// 차트 데이터 타입 정의
interface ChartData {
  time: string;
  price: number;
}

export default function Dashboard() {
  const INITIAL_SEED = 1000000000;
  const MAX_CHART_DATA = 50; // 차트에 표시할 최대 데이터 개수

  const [seed, setSeed] = useState<number>(INITIAL_SEED);
  const [holdings, setHoldings] = useState<number>(0);
  const [orderQty, setOrderQty] = useState<string>("1");
  const [priceData, setPriceData] = useState<PriceData>({
    price: 103300000,
    change: "RISE",
    changePrice: 0,
    timestamp: new Date().toISOString(),
  });
  
  // 차트 데이터를 저장할 상태
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 초기 차트 데이터 생성 (현재가 기준)
    const initialData: ChartData[] = Array.from({ length: MAX_CHART_DATA }, (_, i) => ({
      time: new Date(Date.now() - (MAX_CHART_DATA - i) * 1000).toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: 103300000,
    }));
    setChartData(initialData);

    const eventSource = new EventSource("http://localhost:8080/price/stream");

    eventSource.addEventListener("price-quote", (e) => {
      const data: PriceData = JSON.parse(e.data);
      setPriceData(data);
      setChartData((prev) => {
        const newEntry: ChartData = {
          time: new Date(data.timestamp).toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: data.price,
        };
        const updated = [...prev, newEntry];
        return updated.length > MAX_CHART_DATA ? updated.slice(1) : updated;
      });
    });

    return () => eventSource.close();
  }, []);

  // Y축 범위 계산 (최소/최대값에 여유 공간 둠)
  const prices = chartData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const yAxisDomain = [
    Math.floor(minPrice * 0.999), 
    Math.ceil(maxPrice * 1.001)
  ];

  // 매수/매도 로직 (기존과 동일)
  const handleBuy = () => {
    const qty = parseFloat(orderQty);
    if (isNaN(qty) || qty <= 0) return alert("올바른 수량을 입력하세요.");
    const totalCost = qty * priceData.price;
    if (totalCost > seed) return alert("시드가 부족합니다.");
    setSeed(prev => prev - totalCost);
    setHoldings(prev => prev + qty);
  };

  const handleSell = () => {
    const qty = parseFloat(orderQty);
    if (isNaN(qty) || qty <= 0) return alert("올바른 수량을 입력하세요.");
    if (qty > holdings) return alert("보유 수량이 부족합니다.");
    const totalRevenue = qty * priceData.price;
    setSeed(prev => prev + totalRevenue);
    setHoldings(prev => prev - qty);
  };

  const priceColor = priceData.change === "RISE" ? "text-green-500" : "text-red-500";
  const totalAssets = seed + (holdings * priceData.price);

  if (!isMounted) return null;

  return (
      <div className="h-screen w-screen bg-gray-950 text-white p-4 flex flex-col gap-4 font-sans overflow-hidden box-border">
        
        {/* 1. 상단: 사용자 시드 및 자산 요약 (가로 배치로 공간 절약) */}
        <header className="shrink-0 w-full bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-end gap-3">
            <h1 className="text-sm text-gray-400 font-medium pb-1">보유 시드</h1>
            <div className="text-3xl font-extrabold text-blue-400">
              {Math.floor(seed).toLocaleString()} <span className="text-xl text-gray-200">원</span>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-gray-300 mt-2 md:mt-0">
            <p>보유 코인: <span className="font-bold text-white">{holdings.toFixed(4)} BTC</span></p>
            <p>총 자산: <span className="font-bold text-white">{Math.floor(totalAssets).toLocaleString()} 원</span></p>
          </div>
        </header>

        {/* 2. 중단: 가격 시세 및 주문 영역 */}
        <div className="shrink-0 w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* 시세 패널 */}
          <main className="lg:col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col items-center justify-center">
            <div className={`text-5xl font-extrabold mb-2 ${priceColor} transition-colors tracking-tight`}>
              {priceData.price.toLocaleString()} 원
            </div>
            <div className={`text-xl font-semibold flex items-center gap-2 ${priceColor}`}>
              {priceData.change === "RISE" ? "▲" : "▼"} 
              {Math.abs(priceData.changePrice).toLocaleString()} 원
              <span className="text-sm opacity-80">({((priceData.changePrice / (priceData.price - priceData.changePrice)) * 100).toFixed(2)}%)</span>
            </div>
          </main>

          {/* 주문 패널 */}
          <footer className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm text-gray-400 font-medium">주문 수량 (BTC)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={orderQty}
                onChange={(e) => setOrderQty(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-blue-500 transition-all text-base font-bold"
                placeholder="0.0000"
              />
            </div>
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleBuy}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-3 rounded-lg transition-colors active:scale-95"
              >
                매수
              </button>
              <button
                onClick={handleSell}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-3 rounded-lg transition-colors active:scale-95"
              >
                매도
              </button>
            </div>
          </footer>
        </div>

        {/* 3. 하단: 차트 영역 (남은 화면 높이를 모두 차지함) */}
        <div className="flex-1 w-full bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <h3 className="text-sm text-gray-400 font-medium">가격 추이 (최근 50초)</h3>
            <span className="text-xs text-gray-500">최신 업데이트: {new Date(priceData.timestamp).toLocaleTimeString('ko-KR', { hour12: false })}</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#718096" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={9}
                />
                <YAxis 
                  stroke="#718096" 
                  fontSize={11} 
                  domain={yAxisDomain} 
                  tickFormatter={(value) => value.toLocaleString()}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748', borderRadius: '8px', padding: '8px' }}
                  labelStyle={{ color: '#A0AEC0', marginBottom: '2px', fontSize: '12px' }}
                  itemStyle={{ color: '#F7FAFC', fontWeight: 'bold', fontSize: '14px' }}
                  formatter={(value: any) => [Number(value).toLocaleString() + " 원", "가격"]}
                  labelFormatter={(label) => `시간: ${label}`}
                  cursor={{ stroke: '#4A5568', strokeWidth: 1 }}
                />
                <ReferenceLine y={priceData.price} stroke="#4A5568" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={priceData.change === "RISE" ? "#10B981" : "#EF4444"} 
                  strokeWidth={2}
                  dot={false} 
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
  );
}