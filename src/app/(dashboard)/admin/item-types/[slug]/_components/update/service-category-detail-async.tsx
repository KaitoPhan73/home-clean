import React from "react";
import { getServiceCategoryById } from "@/apis/service-category";
import { FormUpdateServiceCategory } from "@/app/(dashboard)/admin/service-categories/[slug]/_components/update/form-update-service-category";

type Props = {
  slug: string;
};
const ServiceCategoryDetailAsync = async ({ slug }: Props) => {
  const response = await getServiceCategoryById(slug);
  return <FormUpdateServiceCategory initialData={response.payload} />;
};

export default ServiceCategoryDetailAsync;
