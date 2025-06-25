"use client";

import type React from "react";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InfoFieldProps {
  label: string;
  value: string | undefined | null;
  icon?: React.ReactNode;
  copyable?: boolean;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  placeholder?: string;
}

export function InfoField({
  label,
  value,
  icon,
  copyable = false,
  badge,
  placeholder = "No especificado",
}: InfoFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);
    }
  };

  const displayValue = value || undefined;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          {displayValue ? (
            <div className="flex items-center gap-2">
              <p className="font-medium">{displayValue}</p>
              {badge && (
                <Badge variant={badge.variant || "secondary"}>
                  {badge.text}
                </Badge>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">{placeholder}</p>
          )}
        </div>
        {copyable && displayValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
