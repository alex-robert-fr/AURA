import { useEffect, useRef } from 'react';
import { createCityScene } from './scene/scene';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const dispose = createCityScene(canvasRef.current);
    return dispose;
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <canvas ref={canvasRef} className="w-full h-full block outline-none" />
      <header className="absolute top-6 left-6 text-white/80 font-sans tracking-wide select-none">
        <div className="text-xs uppercase opacity-60">Aura</div>
        <div className="text-lg">Architecte · Alex</div>
      </header>
    </div>
  );
}
