import React from "react";
import { Link } from "react-router-dom";
import { usePageTransition } from "../transitions/PageTransition";

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  to,
  variant = "filled",
  style = {},
  ...props
}) {
  const { transitionTo } = usePageTransition();

  const classNames = `magnetic-btn ${
    variant === "outline" ? "outline" : ""
  } ${className}`;

  const handleNavigation = (e) => {
    onClick?.(e);

    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    e.preventDefault();

    // Pass the clicked button so the new page can expand from its position
    transitionTo(to, e.currentTarget);
  };

  if (to) {
    return (
      <Link
        to={to}
        className={classNames}
        style={style}
        onClick={handleNavigation}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classNames}
        style={style}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classNames}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
