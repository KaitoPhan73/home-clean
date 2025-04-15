import React from "react";
import { getAdditionalServicesById } from "@/apis/laudry/addtitional-service";
import { FormUpdateAdditionalService } from "@/app/(dashboard)/admin/additional-services/[slug]/_components/update/form-update-additional-service";

type Props = {
  slug: string;
};

const AdditionalServiceDetailAsync = async ({ slug }: Props) => {
  const response = await getAdditionalServicesById(slug);
  return <FormUpdateAdditionalService initialData={response} />;
};

export default AdditionalServiceDetailAsync;
