/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Wallet, CreditCard, Calendar, CheckCircle, XCircle, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TWalletResponse } from "@/schema/wallet.schema";
import { TTransactionResponse } from "@/schema/transaction.schema";
import { handleErrorApi } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { TUserResponse } from "@/schema/user.schema";
import { getTransactionsInUser, getWalletsInUser } from "@/apis/vinwallet/user";
import { formatCurrency } from "@/app/(dashboard)/manager/order-assignment/_components/order-management/OrderDetailsPopup/utils";

interface WalletTransactionPopupProps {
  user: TUserResponse;
  isOpen: boolean;
  onClose: () => void;
}

export const WalletTransactionPopup: React.FC<WalletTransactionPopupProps> = ({ 
  user, 
  isOpen, 
  onClose 
}) => {
  const [wallets, setWallets] = useState<TWalletResponse[]>([]);
  const [transactions, setTransactions] = useState<TTransactionResponse[]>([]);
  const [loadingWallets, setLoadingWallets] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [activeTab, setActiveTab] = useState("wallets");

  const fetchWallets = async () => {
    if (!user?.id) return;
    try {
      setLoadingWallets(true);
      const response = await getWalletsInUser(user.id);
      setWallets(response.payload.items);
    } catch (error : any) {
      handleErrorApi({ error });
    } finally {
      setLoadingWallets(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user?.id) return;
    try {
      setLoadingTransactions(true);
      const response = await getTransactionsInUser(user.id);
      setTransactions(response.payload.items);
    } catch (error : any) {
      handleErrorApi({ error });
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (activeTab === "wallets") {
        fetchWallets();
      } else if (activeTab === "transactions") {
        fetchTransactions();
      }
    }
  }, [isOpen, activeTab, user?.id]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const getWalletTypeColor = (type: string) => {
    return type === "Personal" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    return type === "Spending" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="font-semibold text-primary">
              {user.fullName}
            </span>
            <span className="text-muted-foreground"> - Ví & Giao dịch</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="wallets" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="wallets" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Ví của người dùng
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Lịch sử giao dịch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallets" className="space-y-4">
            {loadingWallets ? (
              <div className="flex items-center justify-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : wallets.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Người dùng chưa có ví nào
              </div>
            ) : (
              <ScrollArea className="h-[60vh] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wallets.map((wallet) => (
                    <Card key={wallet.id} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: wallet.type === "Personal" ? "#3b82f6" : "#8b5cf6" }}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-medium">{wallet.name}</CardTitle>
                          <Badge variant="outline" className={`${getWalletTypeColor(wallet.type)}`}>
                            {wallet.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Số dư:</span>
                          <span className="text-xl font-semibold">{formatCurrency(wallet.balance)} {wallet.currency}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Trạng thái:</span>
                            <Badge variant="outline" className={wallet.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                              {wallet.status}
                            </Badge>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Ngày tạo:</span>
                            <span>{wallet.createdAt ? format(new Date(wallet.createdAt), "dd/MM/yyyy", { locale: vi }) : "N/A"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {loadingTransactions ? (
              <div className="flex items-center justify-center h-60">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                Không có giao dịch nào
              </div>
            ) : (
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <Card key={transaction.id} className="overflow-hidden border-l-4" 
                      style={{ 
                        borderLeftColor: transaction.status === "Success" 
                          ? "#10b981" 
                          : transaction.status === "Failed" 
                            ? "#ef4444" 
                            : "#f59e0b" 
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-full bg-gray-50">
                                {getStatusIcon(transaction.status || "Pending")}
                              </div>
                              <div>
                                <div className="font-medium">{transaction.note}</div>
                                <div className="text-xs text-muted-foreground">
                                  {transaction.code}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`font-semibold ${transaction.type === "Spending" ? "text-red-600" : "text-green-600"}`}>
                                {transaction.type === "Spending" ? "-" : "+"}{formatCurrency(parseFloat(transaction.amount))}
                              </span>
                              <Badge className={getStatusColor(transaction.status || "Pending")}>
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{format(new Date(transaction.transactionDate), "dd/MM/yyyy HH:mm", { locale: vi })}</span>
                            </div>
                            <div>
                              <Badge variant="outline" className={getTransactionTypeColor(transaction.type)}>
                                {transaction.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};