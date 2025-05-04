"use client";
import { HoverButton } from "@/components/hover-button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  return (
    <>
      <HoverButton
        href={`groups/${data.id}`}
        defaultNode={
          <div className="flex items-center gap-2">
            <EyeOff className="h-4 w-4" />
          </div>
        }
        hoverNode={
          <div className="flex items-center gap-2 text-blue-500">
            <Eye className="h-4 w-4" />
          </div>
        }
        tooltipText="Xem chi tiết"
        size="icon"
      />
    </>
  );
};
