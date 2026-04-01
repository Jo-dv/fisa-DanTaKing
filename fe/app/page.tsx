"use client";

import { useState, useEffect } from "react";

interface PriceData {
  price: number;
  change: "RISE" | "FALL" | string;
  changePrice: number;
  timestamp: string;
}

export default function Dashboard() {
  const INITIAL_SEED = 1000000000;
  
  const [seed, setSeed] = useState<number>(INITIAL_SEED);
  const [holdings, setHoldings] = useState<number>(0);
  const [orderQty, setOrderQty] = useState<string>("1");
  const [priceData, setPriceData] = useState<PriceData>({
    price: 103300000,
    change: "RISE",
    changePrice: 25000,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // 실제 API 연동 시 아래 주석을 해제하고 URL을 백엔드 주소로 변경하세요.
        // const response = await fetch("http://localhost:8080/price/stream");
        // if (!response.ok) throw new Error("Network response was not ok");
        // const data = await response.json();
        // setPriceData(data);

        // 테스트를 위한 임시 데이터 생성 로직 (실제 연동 시 삭제)
        setPriceData(prev => {
          const diff = Math.floor(Math.random() * 2000000) - 1000000;
          const newPrice = prev.price + diff;
          return {
            price: newPrice,
            change: diff >= 0 ? "RISE" : "FALL",
            changePrice: diff,
            timestamp: new Date().toISOString()
          };
        });
      } catch (error) {
        console.error("가격 정보 조회 실패:", error);
      }
    };

    // 1초 주기로 API 호출 (Polling)
    const intervalId = setInterval(fetchPrice, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleBuy = () => {
    const qty = parseFloat(orderQty);
    if (isNaN(qty) || qty <= 0) return alert("올바른 수량을 입력하세요.");

    const totalCost = qty * priceData.price;
    if (totalCost > seed) return alert("시드가 부족합니다. 내 시드보다 큰 금액은 매수할 수 없습니다.");

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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center font-sans">
      
      {/* 1. 사용자 시드 화면 중앙 상단 */}
      <header className="mb-12 text-center w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
        <h1 className="text-xl text-gray-400 mb-2">현재 보유 시드</h1>
        <div className="text-4xl font-bold tracking-tight">{Math.floor(seed).toLocaleString()} 원</div>
        <div className="mt-4 flex justify-between text-sm text-gray-400 px-4">
          <span>보유 코인: {holdings.toFixed(4)} BTC</span>
          <span>총 자산: {Math.floor(totalAssets).toLocaleString()} 원</span>
        </div>
      </header>

      {/* 4. 형태는 대시보드 형태 */}
      <main className="w-full max-w-2xl bg-gray-800 p-10 rounded-xl shadow-md border border-gray-700 mb-12 flex flex-col items-center">
        <h2 className="text-lg text-gray-400 mb-6">BTC/KRW 실시간 가격</h2>
        
        {/* 2. 오르면 초록색 / 3. 떨어지면 빨간색 */}
        <div className={`text-6xl font-bold mb-4 ${priceColor} transition-colors duration-300`}>
          {priceData.price.toLocaleString()} 원
        </div>
        
        <div className={`text-2xl font-medium ${priceColor}`}>
          {priceData.change === "RISE" ? "▲ +" : "▼ "} 
          {priceData.changePrice.toLocaleString()} 원
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          마지막 업데이트: {new Date(priceData.timestamp).toLocaleTimeString()}
        </div>
      </main>

      {/* 5. 매수, 매도 버튼 하단 배치 */}
      <footer className="w-full max-w-2xl bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <label className="text-gray-400 whitespace-nowrap font-medium">주문 수량 (BTC) :</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={orderQty}
            onChange={(e) => setOrderQty(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 text-white p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="수량을 입력하세요"
          />
        </div>
        
        <div className="flex gap-4">
          {/* 6. 매수에 따른 시드 변화 반영 / 8. 내 시드 보다 큰 건수 매수 불가 */}
          <button
            onClick={handleBuy}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-4 rounded-lg transition-colors"
          >
            매수
          </button>
          {/* 6. 매도에 따른 시드 변화 반영 / 7. 시드는 음수가 될 수 없음 */}
          <button
            onClick={handleSell}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white text-lg font-bold py-4 rounded-lg transition-colors"
          >
            매도
          </button>
        </div>
      </footer>
    </div>
  );
}