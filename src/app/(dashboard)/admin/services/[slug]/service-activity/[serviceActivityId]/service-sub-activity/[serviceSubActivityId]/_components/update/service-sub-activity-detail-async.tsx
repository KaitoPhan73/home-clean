import React from "react";
// import { getServiceSubActivityById } from "@/apis/service-sub-activity";
// import { FormUpdateServiceSubActivity } from "@/app/(dashboard)/manager/services/[slug]/service-activity/[serviceActivityId]/service-sub-activity/[serviceSubActivityId]/_components/update/form-update-service-sub-activity";

type Props = {
  slug: string;
};
const ServiceSubActivityDetailAsync = async ({  }: Props) => {
  // const response = await getServiceSubActivityById(slug);
  // return <FormUpdateServiceSubActivity initialData={response.payload} />;
  return <div>ServiceSubActivityDetailAsync</div>;
};
 
export default ServiceSubActivityDetailAsync;
 