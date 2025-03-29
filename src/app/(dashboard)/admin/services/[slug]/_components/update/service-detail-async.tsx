import React from "react";
import { getServiceById } from "@/apis/service";
import { FormUpdateService } from "@/app/(dashboard)/admin/services/[slug]/_components/update/form-update-service";

type Props = {
  slug: string;
};
const ServiceDetailAsync = async ({ slug }: Props) => {
  const response = await getServiceById(slug);
  return <FormUpdateService initialData={response.payload} />;
};

export default ServiceDetailAsync;
