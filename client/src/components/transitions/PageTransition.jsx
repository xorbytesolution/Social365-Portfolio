import React, { createContext, useCallback, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import "./PageTransition.css";

const PageTransitionContext = createContext(null);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error("usePageTransition must be used inside PageTransition");
  }

  return context;
}

export default function PageTransition({ children }) {
  const navigate = useNavigate();
  const isTransitioning = useRef(false);

  const transitionTo = useCallback(
    (to, sourceElement) => {
      if (isTransitioning.current) return;

      isTransitioning.current = true;

      const rect = sourceElement?.getBoundingClientRect();

      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      document.documentElement.style.setProperty("--reveal-x", `${x}px`);
      document.documentElement.style.setProperty("--reveal-y", `${y}px`);
      document.documentElement.style.setProperty(
        "--reveal-radius",
        `${maxRadius}px`,
      );

      const finishNavigation = () => {
        flushSync(() => {
          navigate(to);
          if (window.__lenis) {
            window.__lenis.scrollTo(0, { immediate: true });
          }
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        });
      };

      if (document.startViewTransition) {
        const transition = document.startViewTransition(() => {
          finishNavigation();
        });

        transition.finished.finally(() => {
          if (window.__lenis) {
            window.__lenis.scrollTo(0, { immediate: true });
          }
          window.scrollTo(0, 0);
          isTransitioning.current = false;
        });
      } else {
        finishNavigation();
        isTransitioning.current = false;
      }
    },
    [navigate],
  );

  return (
    <PageTransitionContext.Provider value={{ transitionTo }}>
      {children}
    </PageTransitionContext.Provider>
  );
}
