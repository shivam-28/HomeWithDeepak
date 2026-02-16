"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${
        onClick ? "cursor-pointer active:bg-gray-50" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
