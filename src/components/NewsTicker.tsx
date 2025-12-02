import React from "react";
import { useGameStore } from "../store/useGameStore";

const DEFAULT_NEWS = [
  "[속보] 북부 국경지대에서 미확인 유닛 발견",
  "[경제] 철광석 가격 폭등, 무기 생산 비용 증가 예상",
  "[외교] 동방 상인단 도착, 희귀 자원 거래 가능",
  "[날씨] 올해 농작물 수확량 평년 대비 15% 증가 전망",
];

export const NewsTicker: React.FC = () => {
  const { logs } = useGameStore();

  // Combine recent logs (last 5) with default news if logs are few
  const recentLogs = logs.slice(0, 5).map((log) => `[기록] ${log.text}`);
  const newsItems =
    recentLogs.length > 0 ? [...recentLogs, ...DEFAULT_NEWS] : DEFAULT_NEWS;

  return (
    <div className="w-full h-8 bg-slate-950/90 border-t border-white/10 flex items-center overflow-hidden z-40 pointer-events-none">
      <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
        {/* First Copy */}
        {newsItems.map((news, i) => (
          <span key={i} className="mx-8 text-sm text-stone-300 font-medium">
            {news}
          </span>
        ))}
        {/* Second Copy for Loop */}
        {newsItems.map((news, i) => (
          <span
            key={`dup-${i}`}
            className="mx-8 text-sm text-stone-300 font-medium"
          >
            {news}
          </span>
        ))}
      </div>
    </div>
  );
};
