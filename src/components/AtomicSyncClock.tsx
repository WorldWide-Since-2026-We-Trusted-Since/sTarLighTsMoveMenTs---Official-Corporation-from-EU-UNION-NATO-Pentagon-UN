import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function AtomicSyncClock() {
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    let frameId: number;

    const updateClock = () => {
      const now = new Date();
      
      // Extract components
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ms = String(now.getMilliseconds()).padStart(3, "0").slice(0, 2); // 2-digit miliseconds

      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      setTimeStr(`${hours}:${minutes}:${seconds}.${ms}`);
      setDateStr(`${day}.${month}.${year}`);

      frameId = requestAnimationFrame(updateClock);
    };

    frameId = requestAnimationFrame(updateClock);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div 
      id="atomic-sync-clock"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-black/95 border border-[#bf953f]/40 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(191,149,63,0.25)] backdrop-blur-md select-none font-mono"
    >
      <Clock className="w-3.5 h-3.5 text-[#00ffff] animate-pulse" />
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-black text-[#fcf6ba] tracking-[0.5px] leading-none">
          {timeStr}
        </span>
        <span className="text-[7px] text-gray-400 font-bold tracking-[1.5px] leading-none mt-0.5 uppercase">
          {dateStr} // ATS-SYNC
        </span>
      </div>
    </div>
  );
}
