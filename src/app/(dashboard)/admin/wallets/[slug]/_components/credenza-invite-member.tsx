/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Credenza,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaFooter,
  CredenzaClose,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
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
import { z } from "zod";
import {
  inviteMemberToWallet,
  refetchUserInWallet,
} from "@/apis/vinwallet/wallet";
import { UserPlus } from "lucide-react";
import { ResponsiveComboBoxUserAsync } from "@/components/features/responsive-combobox-user-async";
import { handleErrorApi } from "@/lib/utils";

// Tạo schema validation
const InviteMemberSchema = z.object({
  userId: z.string().min(1, "Vui lòng chọn thành viên"),
});

type InviteMemberFormData = z.infer<typeof InviteMemberSchema>;

type Props = {
  walletId: string;
  className?: string;
};

export function InviteMemberCredenza({ walletId, className }: Props) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(InviteMemberSchema),
    defaultValues: {
      userId: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: InviteMemberFormData) => {
    try {
      const response = await inviteMemberToWallet({
        userId: data.userId,
        walletId: walletId,
      });
      await refetchUserInWallet(walletId);

      if (response.status === 201) {
        toast({
          title: "Thêm thành viên thành công",
          description: "Thành viên mới đã được mời vào ví.",
        });
        form.reset();
        setIsOpen(false);
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể thêm thành viên.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      form.reset();
      handleErrorApi({ error });
    }
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild className={className}>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm thành viên
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="sm:max-w-[525px]">
        <CredenzaHeader>
          <CredenzaTitle>Thêm Thành Viên</CredenzaTitle>
        </CredenzaHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4 py-4"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-4">
                  <Label className="min-w-[100px]">Thành Viên</Label>
                  <div className="flex-1">
                    <FormControl>
                      <ResponsiveComboBoxUserAsync
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                        portal={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <CredenzaFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang thêm..." : "Thêm Thành Viên"}
              </Button>
              <CredenzaClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Đóng
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  );
}
