import { getManagerById } from "@/apis/manager";
import React from "react";
import { FormUpdateManager } from "./form-update-manager";

type Props = {
  slug: string;
};
const ManagerDetailAsync = async ({ slug }: Props) => {
  const response = await getManagerById(slug);
  return <FormUpdateManager initialData={response.payload} />;
};

export default ManagerDetailAsync;
