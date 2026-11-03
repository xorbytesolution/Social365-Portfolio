import React, { useEffect, useState, useRef } from 'react';

/**
 * CustomCursor
 * Luxury custom cursor with trailing momentum ring and dynamic context states
 * (expands on links/buttons, switches to 'DRAG' on 3D canvas, 'EXPLORE' on work cards)
 */
export default function CustomCursor() {
  const [cursorText, setCursorText] = useState('');
  const [cursorType, setCursorType] = useState('default'); // 'default' | 'hover' | 'view' | 'drag'
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check hovered element
      const target = e.target;
      if (!target) return;

      const clickable = target.closest('a, button, .clickable, input, select, textarea');
      const viewCard = target.closest('[data-cursor="view"]');
      const dragCanvas = target.closest('[data-cursor="drag"], .hero-lens-container');

      if (dragCanvas) {
        setCursorType('drag');
        setCursorText('DRAG');
      } else if (viewCard) {
        setCursorType('view');
        setCursorText('VIEW');
      } else if (clickable) {
        setCursorType('hover');
        setCursorText('');
      } else {
        setCursorType('default');
        setCursorText('');
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp loop for the trailing ring
    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      const ease = 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          opacity: cursorType === 'drag' || cursorType === 'view' ? 0 : 1,
        }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${cursorType !== 'default' ? `cursor-${cursorType}` : ''}`}
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.06em',
        }}
      >
        {cursorText}
      </div>
    </>
  );
}

