import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getUsersInWallet } from "@/apis/vinwallet/wallet";
import { TWalletResponse } from "@/schema/wallet.schema";
import { UsersTableActions } from "./users-table-actions";
import { InviteMemberCredenza } from "./credenza-invite-member";

type Props = {
  walletId: string;
  wallet: TWalletResponse;
};

export async function UsersTableInWallet({ walletId, wallet }: Props) {
  const response = await getUsersInWallet(walletId);
  const data = response.payload.items;
  return (
    <Card className="w-full  h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Thành viên</CardTitle>
            <CardDescription>Danh sách thành viên</CardDescription>
          </div>
          <InviteMemberCredenza walletId={walletId} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm font-medium">Thành viên</div>
          <div className="space-y-4">
            {data.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {user.fullName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
                <UsersTableActions
                  userId={user.id}
                  walletId={walletId}
                  isOwner={wallet.ownerId === user.id}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
