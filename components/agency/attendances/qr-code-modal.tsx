"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { X, Download, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  title?: string;
  size?: number;
  className?: string;
}

export function QRCodeModal({
  isOpen,
  onClose,
  value,
  title = "Scan QR Code",
  size = 200,
  className,
}: QRCodeModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Timer states
  const EXPIRY_TIME = 60 * 60; // 1 hour in seconds
  const [timeRemaining, setTimeRemaining] = useState(EXPIRY_TIME);
  const [isExpired, setIsExpired] = useState(false);

  // Reset timer when modal opens with a new QR code
  useEffect(() => {
    if (isOpen && value) {
      setTimeRemaining(EXPIRY_TIME);
      setIsExpired(false);
    }
  }, [isOpen, value]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isOpen && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsExpired(true);
            if (interval) clearInterval(interval);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, timeRemaining]);

  // Format time remaining as HH:MM:SS
  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage (inverted: 100% -> 0%)
  const progressPercentage = (timeRemaining / EXPIRY_TIME) * 100;

  // Handle escape key press
  useEffect(() => {
    setIsMounted(true);

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // Handle clicks outside the modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const canvas = document.createElement("canvas");
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Fill white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  if (!isMounted || !value) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className={cn(
              "relative max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-[#2C2C2C]",
              className
            )}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center">
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>

              {/* Timer display */}
              <div className="w-full mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center text-sm font-medium">
                    <Clock size={16} className="mr-1" />
                    <span>Expira en:</span>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      timeRemaining < 300
                        ? "text-red-500"
                        : timeRemaining < 900
                        ? "text-amber-500"
                        : "text-green-500"
                    )}
                  >
                    {formatTimeRemaining()}
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  className={cn(
                    "h-2",
                    timeRemaining < 300
                      ? "bg-red-100 [&>div]:bg-red-500"
                      : timeRemaining < 900
                      ? "bg-amber-100 [&>div]:bg-amber-500"
                      : "bg-green-100 [&>div]:bg-green-500"
                  )}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "bg-white p-4 rounded-md relative",
                  isExpired && "opacity-50"
                )}
              >
                <QRCode
                  id="qr-code"
                  value={value}
                  size={size}
                  level="H"
                  className="rounded-md"
                />

                {/* Expired overlay */}
                {isExpired && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                    <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-md text-red-500 font-bold">
                      QR EXPIRADO
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 w-full"
              >
                <div className="flex items-center justify-center gap-2 mt-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadQRCode}
                          className="flex items-center gap-1"
                          disabled={isExpired}
                        >
                          <Download size={16} />
                          Descargar
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Descargar como PNG</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
