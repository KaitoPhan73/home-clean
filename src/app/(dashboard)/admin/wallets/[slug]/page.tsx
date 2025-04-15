import { SearchParams } from "nuqs";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import WalletDetailIndex from "./_components/wallet-detail-index";

type PageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
};

const WalletDetail = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  const key = serialize({ ...searchParams });
  return <WalletDetailIndex id={(await props.params).slug} keyProps={key} />;
};

export default WalletDetail;
