import { cookies } from "next/headers";
import { getWalletById } from "@/apis/vinwallet/wallet";
import { WalletForm } from "./wallet-form";

interface WalletDetailAsyncProps {
  id: string;
}

const WalletDetailAsync = async ({ id }: WalletDetailAsyncProps) => {
  const cookieList = await cookies();
  const accessToken = cookieList.get("accessToken")?.value || "";
  const response = await getWalletById(id, accessToken);
  const wallet = response.payload;
  return (
    <div className="space-y-6">
      <WalletForm wallet={wallet} />
    </div>
  );
};

export default WalletDetailAsync;
