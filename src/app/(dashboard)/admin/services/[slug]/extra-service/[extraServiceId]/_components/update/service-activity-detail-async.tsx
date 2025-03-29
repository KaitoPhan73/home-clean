import { getExtraServiceById } from "@/apis/extra-service";
import { FormUpdateExtraService } from "@/app/(dashboard)/admin/services/[slug]/extra-service/[extraServiceId]/_components/update/form-update-service-activity";
import React from "react";

type Props = {
  slug: string;
};
const ExtraServiceDetailAsync = async ({ slug }: Props) => {
  const response = await getExtraServiceById(slug);

  return <FormUpdateExtraService initialData={response.payload} />;
};
 
export default ExtraServiceDetailAsync;
 