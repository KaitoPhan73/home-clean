import React from "react";
import { FormUpdateServiceCategory } from "./form-update-service-category";
import { getServiceCategoryById } from "@/apis/service-category";

type Props = {
  slug: string;
};
const ServiceActivityDetailAsyncc = async ({ slug }: Props) => {
  const response = await getServiceCategoryById(slug);
  return <FormUpdateServiceCategory initialData={response.payload} />;
};

export default ServiceActivityDetailAsyncc;
