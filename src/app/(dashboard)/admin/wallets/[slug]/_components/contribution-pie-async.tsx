/* eslint-disable @typescript-eslint/no-explicit-any */

import ContributionPieChart from "./contribution-pie-chart";
import { getContributionStatistics } from "@/apis/vinwallet/wallet";
import { searchParamsCache } from "@/lib/searchparams";
import { TContributionResponse } from "@/types/wallet";

type TProps = {
  walletId: string;
};
const ContributionPieAsync = async ({ walletId }: TProps) => {
  const days = searchParamsCache.get("days");

  const filters = {
    ...(days && { days }),
  };
  const response = await getContributionStatistics(walletId, filters);
  const data: TContributionResponse = response.payload;
  return <ContributionPieChart data={data} />;
};

export default ContributionPieAsync;
