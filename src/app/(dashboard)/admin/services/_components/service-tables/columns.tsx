/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TServiceResponse } from "@/schema/service.schema";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Package2, 
  Barcode, 
  Hash, 
  Star,
  CheckCircle2,
  XCircle,
  Image
} from "lucide-react";

export const columns: ColumnDef<TServiceResponse>[] = [
  {
    accessorKey: "urlImage",
    header: "Hình Ảnh",
    cell: ({ row }) => {
      const imageUrl = row.getValue("urlImage") as string;
      
      return (
        <div className="flex items-center justify-center">
          {imageUrl ? (
            <div className="h-10 w-10 relative rounded-md overflow-hidden">
              <img 
                src={imageUrl} 
                alt={row.getValue("name") as string} 
                className="object-cover h-full w-full"
              />
            </div>
          ) : (
            <div className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded-md">
              <Image className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên Dịch Vụ",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 w-40 cursor-pointer">
                <Package2 className="h-4 w-4 text-muted-foreground" />
                <div className="truncate font-medium" title={service.name}>
                  {service.name}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{service.description || "Không có mô tả"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "serviceCode",
    header: "Mã Dịch Vụ",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Barcode className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono">{row.getValue("serviceCode")}</span>
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: "Mã Code",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono">{row.getValue("code")}</span>
      </div>
    ),
  },
  {
    accessorKey: "prorityLevel",
    header: "Mức Ưu Tiên",
    cell: ({ row }) => {
      const level = parseInt(row.getValue("prorityLevel"));
      const stars = Array(level).fill(0);
      
      return (
        <div className="flex items-center gap-1">
          {stars.map((_, i) => (
            <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
          ))}
          {level === 0 && <span className="text-sm text-muted-foreground">Không ưu tiên</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng Thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center gap-1">
          {status === "Active" ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Hoạt động</span>
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              <span>Không hoạt động</span>
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];