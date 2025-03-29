import React from "react";
import { getServiceActivityById } from "@/apis/service-activity";
import { FormUpdateServiceActivity } from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/_components/update/form-update-service-activity";

type Props = {
  slug: string;
};
const ServiceActivityDetailAsync = async ({ slug }: Props) => {
  const response = await getServiceActivityById(slug);
  // console.log("🚀 ~ ServiceActivityDetailAsync ~ response:", slug)

  return <FormUpdateServiceActivity initialData={response.payload} />;
};
 
export default ServiceActivityDetailAsync;
 