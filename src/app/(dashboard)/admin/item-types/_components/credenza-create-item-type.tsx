// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // ItemTypeCreationForm.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Credenza,
//   CredenzaTrigger,
//   CredenzaContent,
//   CredenzaHeader,
//   CredenzaTitle,
//   CredenzaDescription,
//   CredenzaFooter,
//   CredenzaClose,
// } from "@/components/ui/credenza";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Box, Tag, ImageIcon, Settings, Star } from "lucide-react";
// import { handleErrorApi } from "@/lib/utils";
// import { Textarea } from "@/components/ui/textarea";
// import { getAllServiceTypes } from "@/apis/laudry/service-type";
// import {
//   ItemTypeCreateSchema,
//   TItemTypeCreateRequest,
// } from "@/schema/VinLaudry/item-type.schema";
// import { createItemType } from "@/apis/laudry/item-type";
// import { useRouter } from "next/navigation";

// interface ServiceType {
//   id: string;
//   name: string;
//   type: string;
// }

// export function CredenzaCreateItemType({
//   accessToken,
//   className,
// }: {
//   accessToken?: string;
//   className?: string;
// }) {
//   const { toast } = useToast();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [serviceTypeOptions, setServiceTypeOptions] = useState<ServiceType[]>(
//     []
//   );
//   const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
//     null
//   );
//   const router = useRouter();

//   const form = useForm<TItemTypeCreateRequest>({
//     resolver: zodResolver(ItemTypeCreateSchema),
//     defaultValues: {
//       itemCode: "",
//       name: "",
//       description: "",
//       defaultPrice: 0,
//       pricePerItem: null,
//       pricePerKg: null,
//       imageUrl: "",
//       minWeight: 0,
//       maxWeight: 100, // Default max weight to 100kg
//       standardProcessingTime: 0,
//       serviceTypeId: "",
//     },
//   });

//   // Fetch data when form opens
//   useEffect(() => {
//     if (isOpen) {
//       fetchServiceTypes();
//     }
//   }, [isOpen]);

//   // Track selected service type
//   useEffect(() => {
//     const serviceTypeId = form.watch("serviceTypeId");
//     if (serviceTypeId) {
//       const selectedType = serviceTypeOptions.find(
//         (type) => type.id === serviceTypeId
//       );
//       setSelectedServiceType(selectedType?.type || null);
//     } else {
//       setSelectedServiceType(null);
//     }
//   }, [form.watch("serviceTypeId"), serviceTypeOptions]);

//   const fetchServiceTypes = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getAllServiceTypes();
//       if (response?.payload?.items) {
//         setServiceTypeOptions(response.payload.items);
//       }
//     } catch (error: any) {
//       handleErrorApi({ error });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onSubmit = async (data: TItemTypeCreateRequest) => {
//     try {
//       setIsLoading(true);
//       console.log("Submitting item type data:", data);

//       const response = await createItemType({
//         ...data,
//         _token: accessToken,
//       });

//       if (response.status === 201) {
//         toast({
//           title: "Thành công",
//           description: "Mặt hàng đã được tạo thành công.",
//         });
//         form.reset();
//         setIsOpen(false);
//         router.refresh()
//       }
//     } catch (error: any) {
//       handleErrorApi({
//         error,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Credenza open={isOpen} onOpenChange={setIsOpen}>
//       <CredenzaTrigger asChild className={className}>
//         <Button variant="default" className="flex items-center gap-1">
//           <Tag size={16} />
//           <span>Tạo Mặt Hàng</span>
//         </Button>
//       </CredenzaTrigger>
//       <CredenzaContent className="sm:max-w-3xl">
//         <div className="max-h-[85vh] overflow-y-auto px-2">
//           <CredenzaHeader className="pb-4">
//             <CredenzaTitle className="text-xl font-bold flex items-center gap-2">
//               <Tag className="h-5 w-5" /> Tạo Mặt Hàng Mới
//             </CredenzaTitle>
//             <CredenzaDescription>
//               Điền thông tin để tạo mặt hàng mới trong hệ thống
//             </CredenzaDescription>
//           </CredenzaHeader>
//           <Separator className="my-2" />

//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="space-y-5 py-4"
//             >
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 {/* Thông tin cơ bản */}
//                 <Card className="p-4 col-span-1 sm:col-span-2 bg-slate-50 shadow-sm">
//                   <h3 className="font-medium text-lg mb-3 flex items-center gap-2 text-blue-700">
//                     <Box className="h-5 w-5" /> Thông tin cơ bản
//                   </h3>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="name"
//                       render={({ field }) => (
//                         <FormItem>
//                           <Label className="font-medium">Tên Mặt Hàng</Label>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               placeholder="Nhập tên mặt hàng..."
//                               className="bg-white"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="itemCode"
//                       render={({ field }) => (
//                         <FormItem>
//                           <Label className="font-medium">Mã Mặt Hàng</Label>
//                           <FormControl>
//                             <Input
//                               {...field}
//                               placeholder="Nhập mã mặt hàng..."
//                               className="bg-white"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="serviceTypeId"
//                       render={({ field }) => (
//                         <FormItem className="col-span-full">
//                           <Label className="font-medium">Loại Dịch Vụ</Label>
//                           <Select
//                             onValueChange={(value) => {
//                               field.onChange(value);
//                               // Reset price fields when service type changes
//                               const selectedType = serviceTypeOptions.find(
//                                 (t) => t.id === value
//                               )?.type;
//                               if (selectedType === "PerItem") {
//                                 form.setValue("pricePerKg", null);
//                               } else if (selectedType === "PerKg") {
//                                 form.setValue("pricePerItem", null);
//                               }
//                             }}
//                             value={field.value}
//                             disabled={isLoading}
//                           >
//                             <FormControl>
//                               <SelectTrigger className="bg-white">
//                                 <SelectValue placeholder="Chọn loại dịch vụ" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {serviceTypeOptions.length === 0 ? (
//                                 <SelectItem value="loading" disabled>
//                                   Không có dữ liệu loại dịch vụ
//                                 </SelectItem>
//                               ) : (
//                                 serviceTypeOptions.map((type) => (
//                                   <SelectItem key={type.id} value={type.id}>
//                                     {type.name}
//                                   </SelectItem>
//                                 ))
//                               )}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="description"
//                       render={({ field }) => (
//                         <FormItem className="col-span-full">
//                           <Label className="font-medium">Mô Tả</Label>
//                           <FormControl>
//                             <Textarea
//                               {...field}
//                               value={field.value || ""}
//                               placeholder="Nhập mô tả mặt hàng..."
//                               className="resize-none bg-white"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </Card>

//                 {/* Thông tin giá cả */}
//                 <Card className="p-4 col-span-1 bg-slate-50 shadow-sm">
//                   <h3 className="font-medium text-lg mb-3 flex items-center gap-2 text-green-700">
//                     <Star className="h-5 w-5" /> Thông tin giá điểm
//                   </h3>

//                   <div className="grid grid-cols-1 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="defaultPrice"
//                       render={({
//                         field: { onChange, value, ...fieldProps },
//                       }) => (
//                         <FormItem>
//                           <Label className="font-medium">
//                             Giá Mặc Định (điểm)
//                           </Label>
//                           <div className="relative">
//                             <FormControl>
//                               <Input
//                                 type="number"
//                                 {...fieldProps}
//                                 value={value?.toString() || "0"}
//                                 onChange={(e) => {
//                                   const val = Number(e.target.value);
//                                   if (val >= 0 && val <= 10000000) {
//                                     onChange(val);
//                                   }
//                                 }}
//                                 placeholder="0"
//                                 className="pl-2 pr-9 bg-white"
//                                 min="0"
//                                 max="10000000"
//                               />
//                             </FormControl>
//                             <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
//                           </div>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Nhập giá từ 0 đến 10.000.000 điểm
//                           </p>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     {(!selectedServiceType ||
//                       selectedServiceType === "PerItem") && (
//                       <FormField
//                         control={form.control}
//                         name="pricePerItem"
//                         render={({
//                           field: { onChange, value, ...fieldProps },
//                         }) => (
//                           <FormItem>
//                             <Label className="font-medium">
//                               Giá Theo Món (điểm/món)
//                             </Label>
//                             <div className="relative">
//                               <FormControl>
//                                 <Input
//                                   type="number"
//                                   {...fieldProps}
//                                   value={
//                                     value === null
//                                       ? ""
//                                       : value?.toString() || ""
//                                   }
//                                   onChange={(e) => {
//                                     const val =
//                                       e.target.value === ""
//                                         ? null
//                                         : Number(e.target.value);
//                                     if (
//                                       val === null ||
//                                       (val >= 0 && val <= 10000000)
//                                     ) {
//                                       onChange(val);
//                                     }
//                                   }}
//                                   placeholder="0"
//                                   className="pl-2 pr-9 bg-white"
//                                   min="0"
//                                   max="10000000"
//                                 />
//                               </FormControl>
//                               <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                               Nhập giá từ 0 đến 10.000.000 điểm
//                             </p>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     )}

//                     {(!selectedServiceType ||
//                       selectedServiceType === "PerKg") && (
//                       <FormField
//                         control={form.control}
//                         name="pricePerKg"
//                         render={({
//                           field: { onChange, value, ...fieldProps },
//                         }) => (
//                           <FormItem>
//                             <Label className="font-medium">
//                               Giá Theo Kg (điểm/kg)
//                             </Label>
//                             <div className="relative">
//                               <FormControl>
//                                 <Input
//                                   type="number"
//                                   {...fieldProps}
//                                   value={
//                                     value === null
//                                       ? ""
//                                       : value?.toString() || ""
//                                   }
//                                   onChange={(e) => {
//                                     const val =
//                                       e.target.value === ""
//                                         ? null
//                                         : Number(e.target.value);
//                                     if (
//                                       val === null ||
//                                       (val >= 0 && val <= 10000000)
//                                     ) {
//                                       onChange(val);
//                                     }
//                                   }}
//                                   placeholder="0"
//                                   className="pl-2 pr-9 bg-white"
//                                   min="0"
//                                   max="10000000"
//                                 />
//                               </FormControl>
//                               <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">
//                               Nhập giá từ 0 đến 10.000.000 điểm
//                             </p>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     )}
//                   </div>
//                 </Card>

//                 {/* Thông tin kỹ thuật */}
//                 <Card className="p-4 col-span-1 bg-slate-50 shadow-sm">
//                   <h3 className="font-medium text-lg mb-3 flex items-center gap-2 text-purple-700">
//                     <Settings className="h-5 w-5" /> Thông số kỹ thuật
//                   </h3>

//                   <div className="grid grid-cols-1 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="minWeight"
//                       render={({
//                         field: { onChange, value, ...fieldProps },
//                       }) => (
//                         <FormItem>
//                           <Label className="font-medium">
//                             Trọng Lượng Tối Thiểu (kg)
//                           </Label>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               {...fieldProps}
//                               value={value?.toString() || "0"}
//                               onChange={(e) =>
//                                 onChange(Number(e.target.value) || 0)
//                               }
//                               placeholder="0"
//                               step="0.1"
//                               min="0"
//                               className="bg-white"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="maxWeight"
//                       render={({
//                         field: { onChange, value, ...fieldProps },
//                       }) => (
//                         <FormItem>
//                           <Label className="font-medium">
//                             Trọng Lượng Tối Đa (kg)
//                           </Label>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               {...fieldProps}
//                               value={value?.toString() || "100"}
//                               onChange={(e) =>
//                                 onChange(Number(e.target.value) || 100)
//                               }
//                               placeholder="100"
//                               step="0.1"
//                               min="0"
//                               max="100"
//                               className="bg-white"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="standardProcessingTime"
//                       render={({
//                         field: { onChange, value, ...fieldProps },
//                       }) => (
//                         <FormItem>
//                           <Label className="font-medium">
//                             Thời Gian Xử Lý (phút)
//                           </Label>
//                           <FormControl>
//                             <Input
//                               type="number"
//                               {...fieldProps}
//                               value={value?.toString() || "0"}
//                               onChange={(e) =>
//                                 onChange(Number(e.target.value) || 0)
//                               }
//                               placeholder="0"
//                               className="bg-white"
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </Card>

//                 {/* Hình ảnh */}
//                 <Card className="p-4 col-span-1 sm:col-span-2 bg-slate-50 shadow-sm">
//                   <h3 className="font-medium text-lg mb-3 flex items-center gap-2 text-orange-700">
//                     <ImageIcon className="h-5 w-5" /> Hình ảnh
//                   </h3>

//                   <FormField
//                     control={form.control}
//                     name="imageUrl"
//                     render={({ field }) => (
//                       <FormItem>
//                         <Label className="font-medium">URL Hình Ảnh</Label>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             value={field.value || ""}
//                             placeholder="Nhập đường dẫn hình ảnh..."
//                             className="bg-white"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </Card>
//               </div>

//               <Separator className="my-2" />

//               <CredenzaFooter className="gap-2 pt-2">
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="min-w-28 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
//                 >
//                   {isLoading ? "Đang xử lý..." : "Tạo Mặt Hàng"}
//                 </Button>
//                 <CredenzaClose asChild>
//                   <Button variant="outline" type="button">
//                     Đóng
//                   </Button>
//                 </CredenzaClose>
//               </CredenzaFooter>
//             </form>
//           </Form>
//         </div>
//       </CredenzaContent>
//     </Credenza>
//   );
// }


/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Box, Tag, ImageIcon, Settings, Star } from "lucide-react";
import { handleErrorApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { getAllServiceTypes } from "@/apis/laudry/service-type";
import {
  ItemTypeCreateSchema,
  TItemTypeCreateRequest,
} from "@/schema/VinLaudry/item-type.schema";
import { createItemType } from "@/apis/laudry/item-type";
import { useRouter } from "next/navigation";

interface ServiceType {
  id: string;
  name: string;
  type: string;
}

// Utility function to convert image URL to base64
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result); // Returns base64 string (e.g., data:image/jpeg;base64,...)
        } else {
          reject(new Error("Failed to convert to base64"));
        }
      };
      reader.onerror = () => reject(new Error("Error reading image"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error("Invalid image URL or failed to convert to base64");
  }
};

export function CredenzaCreateItemType({
  accessToken,
  className,
}: {
  accessToken?: string;
  className?: string;
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceTypeOptions, setServiceTypeOptions] = useState<ServiceType[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null
  );
  const router = useRouter();

  const form = useForm<TItemTypeCreateRequest>({
    resolver: zodResolver(ItemTypeCreateSchema),
    defaultValues: {
      itemCode: "",
      name: "",
      description: "",
      defaultPrice: 0,
      pricePerItem: null,
      pricePerKg: null,
      imageUrl: "",
      minWeight: 0,
      maxWeight: 100,
      standardProcessingTime: 0,
      serviceTypeId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchServiceTypes();
    }
  }, [isOpen]);

  useEffect(() => {
    const serviceTypeId = form.watch("serviceTypeId");
    if (serviceTypeId) {
      const selectedType = serviceTypeOptions.find(
        (type) => type.id === serviceTypeId
      );
      setSelectedServiceType(selectedType?.type || null);
    } else {
      setSelectedServiceType(null);
    }
  }, [form.watch("serviceTypeId"), serviceTypeOptions]);

  const fetchServiceTypes = async () => {
    setIsLoading(true);
    try {
      const response = await getAllServiceTypes();
      if (response?.payload?.items) {
        setServiceTypeOptions(response.payload.items);
      }
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: TItemTypeCreateRequest) => {
    try {
      setIsLoading(true);
      let base64Image = "";
      // Convert image URL to base64 if provided
      if (data.imageUrl) {
        try {
          base64Image = await urlToBase64(data.imageUrl);
        } catch (error) {
          toast({
            title: "Lỗi",
            description: "Không thể chuyển đổi URL hình ảnh sang base64.",
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare data for submission (replace imageUrl with base64Image)
      const submitData = {
        ...data,
        imageUrl: base64Image, // Send base64 string to API
        _token: accessToken,
      };

      console.log("Submitting item type data:", submitData);

      const response = await createItemType(submitData);

      if (response.status === 201) {
        toast({
          title: "Thành công",
          description: "Mặt hàng đã được tạo thành công.",
        });
        form.reset();
        setIsOpen(false);
        router.refresh();
      }
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button variant="default" className="flex items-center gap-1">
          <Tag size={16} />
          <span>Tạo Mặt Hàng</span>
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-3xl">
        <div className="max-h-[85vh] overflow-y-auto px-2">
          <CredenzaHeader className="pb-4">
            <CredenzaTitle className="text-xl font-bold flex items-center gap-2">
              <Tag className="h-5 w-5" /> Tạo Mặt Hàng Mới
            </CredenzaTitle>
            <CredenzaDescription>
              Điền thông tin để tạo mặt hàng mới trong hệ thống
            </CredenzaDescription>
          </CredenzaHeader>
          <Separator className="my-2" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Thông tin cơ bản */}
                <Card className="p-4 col-span-1 sm:col-span-2 bg-slate-50 shadow-sm">
                  <h3 className="font-medium text-lg mb-3 flex items-center gap-2 text-blue-700">
                    <Box className="h-5 w-5" /> Thông tin cơ bản
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-medium">Tên Mặt Hàng</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập tên mặt hàng..."
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="itemCode"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="font-medium">Mã Mặt Hàng</Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập mã mặt hàng..."
                              className="bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceTypeId"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <Label className="font-medium">Loại Dịch Vụ</Label>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selectedType = serviceTypeOptions.find(
                                (t) => t.id === value
                              )?.type;
                              if (selectedType === "PerItem") {
                                form.setValue("pricePerKg", null);
                              } else if (selectedType === "PerKg") {
                                form.setValue("pricePerItem", null);
                              }
                            }}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Chọn loại dịch vụ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceTypeOptions.length === 0 ? (
                                <SelectItem value="loading" disabled>
                                  Không có dữ liệu loại dịch vụ
                                </SelectItem>
                              ) : (
                                serviceTypeOptions.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <Label className="font-medium">Mô Tả</Label>
                          <FormControl>
                            <Textarea
                              {...field}
                              value={field.value || ""}
                              placeholder="Nhập mô tả mặt hàng..."
                              className="resize-none bg-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                {/* Thông tin giá cả */}
                <Card className="p-4 col-span-1 bg-slate-50 shadow-sm">
                  <h3 className="font-medium text-lg mb-3 flex items-center gap-2 text-green-700">
                    <Star className="h-5 w-5" /> Thông tin giá điểm
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="defaultPrice"
                      render={({
                        field: { onChange, value, ...fieldProps },
                      }) => (
                        <FormItem>
                          <Label className="font-medium">
                            Giá Mặc Định (điểm)
                          </Label>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type="number"
                                {...fieldProps}
                                value={value?.toString() || "0"}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  if (val >= 0 && val <= 10000000) {
                                    onChange(val);
                                  }
                                }}
                                placeholder="0"
                                className="pl-2 pr-9 bg-white"
                                min="0"
                                max="10000000"
                              />
                            </FormControl>
                            <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Nhập giá từ 0 đến 10.000.000 điểm
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {(!selectedServiceType ||
                      selectedServiceType === "PerItem") && (
                      <FormField
                        control={form.control}
                        name="pricePerItem"
                        render={({
                          field: { onChange, value, ...fieldProps },
                        }) => (
                          <FormItem>
                            <Label className="font-medium">
                              Giá Theo Món (điểm/món)
                            </Label>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type="number"
                                  {...fieldProps}
                                  value={
                                    value === null
                                      ? ""
                                      : value?.toString() || ""
                                  }
                                  onChange={(e) => {
                                    const val =
                                      e.target.value === ""
                                        ? null
                                        : Number(e.target.value);
                                    if (
                                      val === null ||
                                      (val >= 0 && val <= 10000000)
                                    ) {
                                      onChange(val);
                                    }
                                  }}
                                  placeholder="0"
                                  className="pl-2 pr-9 bg-white"
                                  min="0"
                                  max="10000000"
                                />
                              </FormControl>
                              <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Nhập giá từ 0 đến 10.000.000 điểm
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {(!selectedServiceType ||
                      selectedServiceType === "PerKg") && (
                      <FormField
                        control={form.control}
                        name="pricePerKg"
                        render={({
                          field: { onChange, value, ...fieldProps },
                        }) => (
                          <FormItem>
                            <Label className="font-medium">
                              Giá Theo Kg (điểm/kg)
                            </Label>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type="number"
                                  {...fieldProps}
                                  value={
                                    value === null
                                      ? ""
                                      : value?.toString() || ""
                                  }
                                  onChange={(e) => {
                                    const val =
                                      e.target.value === ""
                                        ? null
                                        : Number(e.target.value);
                                    if (
                                      val === null ||
                                      (val >= 0 && val <= 10000000)
                                    ) {
                                      onChange(val);
                                    }
                                  }}
                                  placeholder="0"
                                  className="pl-2 pr-9 bg-white"
                                  min="0"
                                  max="10000000"
                                />
                              </FormControl>
                              <Star className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Nhập giá từ 0 đến 10.000.000 điểm
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </Card>

                {/* Thông tin kỹ thuật */}
                <Card className="p-4 col-span-1 bg-slate-50 shadow-sm">
                  <h3 className="font-medium text-lg mb-3 flex items-center gap-2 text-purple-700">
                    <Settings className="h-5 w-5" /> Thông số kỹ thuật
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="minWeight"
                      render={({
                        field: { onChange, value, ...fieldProps },
                      }) => (
                        <FormItem>
                          <Label className="font-medium">
                            Trọng Lượng Tối Thiểu (kg)
                          </Label>
                          <FormControl>
                            <Input
                              type="number"
                              {...fieldProps}
                              value={value?.toString() || "0"}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val >= 0) {
                                  onChange(val);
                                }
                              }}
                              placeholder="0"
                              step="0.1"
                              min="0"
                              className="bg-white"
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            Trọng lượng tối thiểu không được âm
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxWeight"
                      render={({
                        field: { onChange, value, ...fieldProps },
                      }) => (
                        <FormItem>
                          <Label className="font-medium">
                            Trọng Lượng Tối Đa (kg)
                          </Label>
                          <FormControl>
                            <Input
                              type="number"
                              {...fieldProps}
                              value={value?.toString() || "100"}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val >= 0 && val <= 100) {
                                  onChange(val);
                                }
                              }}
                              placeholder="100"
                              step="0.1"
                              min="0"
                              max="100"
                              className="bg-white"
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            Trọng lượng tối đa từ 0 đến 100kg
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="standardProcessingTime"
                      render={({
                        field: { onChange, value, ...fieldProps },
                      }) => (
                        <FormItem>
                          <Label className="font-medium">
                            Thời Gian Xử Lý (phút)
                          </Label>
                          <FormControl>
                            <Input
                              type="number"
                              {...fieldProps}
                              value={value?.toString() || "0"}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val >= 0) {
                                  onChange(val);
                                }
                              }}
                              placeholder="0"
                              min="0"
                              className="bg-white"
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            Thời gian xử lý không được âm
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                {/* Hình ảnh */}
                <Card className="p-4 col-span-1 sm:col-span-2 bg-slate-50 shadow-sm">
                  <h3 className="font-medium text-lg mb-3 flex items-center gap-2 text-orange-700">
                    <ImageIcon className="h-5 w-5" /> Hình ảnh
                  </h3>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="font-medium">URL Hình Ảnh</Label>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="Nhập đường dẫn hình ảnh..."
                            className="bg-white"
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          URL sẽ được chuyển thành base64 khi gửi
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>
              </div>

              <Separator className="my-2" />

              <CredenzaFooter className="gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-28 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isLoading ? "Đang xử lý..." : "Tạo Mặt Hàng"}
                </Button>
                <CredenzaClose asChild>
                  <Button variant="outline" type="button">
                    Đóng
                  </Button>
                </CredenzaClose>
              </CredenzaFooter>
            </form>
          </Form>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}