"use client";

import { useEffect, useRef, useState } from "react";

const FIELD_WIDTH = 640;
const FIELD_HEIGHT = 480;

type BallType = "none" | "basketball" | "football" | "volleyball" | "human";

const ballImages: Record<BallType, string> = {
  none: "none",
  basketball: "url(/animation/basketball.png)",
  football: "url(/animation/football.png)",
  volleyball: "url(/animation/volleyball.png)",
  human: "url(/animation/human.png)",
};

const ballOptions: { type: BallType; label: string }[] = [
  { type: "none", label: "None" },
  { type: "basketball", label: "Basketball" },
  { type: "football", label: "Football" },
  { type: "volleyball", label: "Volleyball" },
  { type: "human", label: "Human" },
];

const keyToBallType: Record<string, BallType> = {
  Digit1: "none",
  Digit2: "basketball",
  Digit3: "football",
  Digit4: "volleyball",
  Digit5: "human",
};

type AnimationProps = {
  ballRadius?: number;
};

export default function Animation({ ballRadius }: AnimationProps) {
  const _ballRadius = ballRadius || 50;
  const ballSize = _ballRadius * 2;

  const [ballType, setBallType] = useState<BallType>("none");
  const [isRunning, setIsRunning] = useState(false);

  const ballRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  const rotationRef = useRef(0);
  const posRef = useRef({
    x: FIELD_WIDTH / 2 - _ballRadius,
    y: FIELD_HEIGHT / 2 - _ballRadius,
    vx: 3,
    vy: 2.4,
  });

  // ตั้งตำแหน่งเริ่มต้น / เมื่อขนาดบอลเปลี่ยน
  useEffect(() => {
    if (ballRef.current) {
      ballRef.current.style.left = `${posRef.current.x}px`;
      ballRef.current.style.top = `${posRef.current.y}px`;
      ballRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
    }
  }, [ballSize]);

  // loop animation
  useEffect(() => {
    if (!isRunning) return;

    const step = () => {
      let { x, y, vx, vy } = posRef.current;
      x += vx;
      y += vy;

      if (x <= 0) {
        x = 0;
        vx = -vx;
      } else if (x + ballSize >= FIELD_WIDTH) {
        x = FIELD_WIDTH - ballSize;
        vx = -vx;
      }

      if (y <= 0) {
        y = 0;
        vy = -vy;
      } else if (y + ballSize >= FIELD_HEIGHT) {
        y = FIELD_HEIGHT - ballSize;
        vy = -vy;
      }

      posRef.current = { x, y, vx, vy };

      // หมุนตามระยะที่กลิ้งไปในแต่ละเฟรม (ระยะ / รัศมี = มุมเรเดียน)
      const distance = Math.sqrt(vx * vx + vy * vy);
      const deltaDeg = (distance / _ballRadius) * (180 / Math.PI);
      rotationRef.current += vx >= 0 ? deltaDeg : -deltaDeg;

      if (ballRef.current) {
        ballRef.current.style.left = `${x}px`;
        ballRef.current.style.top = `${y}px`;
        ballRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }

      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);

    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, ballSize, _ballRadius]);

  // keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning((prev) => !prev);
        return;
      }
      const type = keyToBallType[e.code];
      if (type) setBallType(type);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="mx-auto w-fit">
      {/* field */}
      <div
        className="relative overflow-hidden border-2 border-black"
        style={{
          width: FIELD_WIDTH,
          height: FIELD_HEIGHT,
          backgroundImage: "url(/animation/field.jpg)",
          backgroundSize: "cover",
        }}
      >
        {/* ball */}
        <div
          ref={ballRef}
          className="absolute overflow-hidden rounded-full border border-black"
          style={{
            width: ballSize,
            height: ballSize,
            boxSizing: "border-box",
            backgroundImage: ballImages[ballType],
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* button row */}
      <div className="mt-3 flex justify-between gap-4">
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          className={`rounded px-4 py-2 text-white ${
            isRunning
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isRunning ? "Stop" : "Run"}{" "}
          <kbd className="ml-1 rounded bg-black/30 px-1.5 py-0.5 text-xs">
            Space
          </kbd>
        </button>

        <div className="flex flex-wrap justify-end gap-2">
          {ballOptions.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setBallType(type)}
              className={`rounded border px-3 py-2 ${
                ballType === type
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
