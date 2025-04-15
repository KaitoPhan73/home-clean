import React from "react";
import { getOrderById } from "@/apis/laudry/order";
import FormLaundryOrderDetail from "@/app/(dashboard)/admin/laundry-orders/[slug]/_components/update/FormLaundryOrderDetail";

type Props = {
  slug: string;
};
const LaundryOrderDetailAsync = async ({ slug }: Props) => {
  const response = await getOrderById(slug);
  return <FormLaundryOrderDetail initialData={response} />;
};

export default LaundryOrderDetailAsync;
