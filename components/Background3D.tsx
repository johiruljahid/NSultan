
import React, { useEffect, useState } from 'react';

const Background3D: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Dynamic Glow Orbs */}
      <div 
        className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-amber-600/10 rounded-full bg-glow"
        style={{ transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)` }}
      ></div>
      <div 
        className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] bg-red-600/10 rounded-full bg-glow"
        style={{ transform: `translate(${-mousePos.x * 2}px, ${-mousePos.y * 2}px)` }}
      ></div>

      {/* Floating 3D Shapes */}
      <div 
        className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-amber-600/20 rotate-45 animate-3-float"
        style={{ transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px) rotate(45deg)` }}
      ></div>
      <div 
        className="absolute bottom-1/4 left-1/3 w-20 h-20 border-2 border-red-600/20 rounded-full animate-3-float"
        style={{ transform: `translate(${mousePos.x * -4}px, ${mousePos.y * -4}px)` }}
      ></div>
      
      {/* Grid Pattern with depth */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
             backgroundSize: '40px 40px',
             transform: `perspective(1000px) rotateX(60deg) translateY(${mousePos.y}px)`
           }}>
      </div>
    </div>
  );
};

export default Background3D;
