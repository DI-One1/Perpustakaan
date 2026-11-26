import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type?: "kosong" | "error" | "404";
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const TYPE_ILLUSTRATIONS: Record<string, string> = {
  kosong: "/images/defaults/ilustrasi-kosong.svg",
  error: "/images/defaults/ilustrasi-error.svg",
  "404": "/images/defaults/ilustrasi-404.svg",
};

export function EmptyState({
  type = "kosong",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const imgSrc = TYPE_ILLUSTRATIONS[type] || TYPE_ILLUSTRATIONS.kosong;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="relative mb-6 h-[180px] w-[240px] sm:h-[220px] sm:w-[300px]">
        <Image
          src={imgSrc}
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>

      <h3 className="text-lg font-bold text-foreground sm:text-xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
