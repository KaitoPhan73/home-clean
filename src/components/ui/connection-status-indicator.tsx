// components/ui/connection-status-indicator.tsx
'use client';

import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSignalRContext } from '@/context/signalr-provider';

export const ConnectionStatusIndicator = () => {
  const { connectionStatus, connectionId } = useSignalRContext();

  let icon;
  let statusText;
  let statusClass;

  switch (connectionStatus) {
    case 'connected':
      icon = <Wifi className="h-4 w-4" />;
      statusText = `Đã kết nối (ID: ${connectionId?.substring(0, 6)}...)`;
      statusClass = 'text-green-500';
      break;
    case 'connecting':
      icon = <Loader2 className="h-4 w-4 animate-spin" />;
      statusText = 'Đang kết nối...';
      statusClass = 'text-yellow-500';
      break;
    case 'disconnected':
      icon = <WifiOff className="h-4 w-4" />;
      statusText = 'Mất kết nối';
      statusClass = 'text-gray-500';
      break;
    case 'error':
      icon = <WifiOff className="h-4 w-4" />;
      statusText = 'Lỗi kết nối';
      statusClass = 'text-red-500';
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="flex items-center gap-1 mr-100">
          <span className={statusClass}>{icon}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};