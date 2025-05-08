import { getStaffById } from "@/apis/staff";
import React from "react";
import { FormUpdateStaff } from "./form-update-staff";

type Props = {
  slug: string;
};

const StaffDetailAsync = async ({ slug }: Props) => {
  const response = await getStaffById(slug);
  return <FormUpdateStaff initialData={response.payload} />;
};

export default StaffDetailAsync;
