import React from "react";
import { FormUpdateTimeSlot } from "@/app/(dashboard)/manager/time-slots/[slug]/_components/update/form-update-time-slot";
import { getTimeSlotById } from "@/apis/time-slot";

type Props = {
  slug: string;
};
const TimeSlotDetailAsync = async ({ slug }: Props) => {
  const response = await getTimeSlotById(slug);
  return <FormUpdateTimeSlot initialData={response.payload} />;
};

export default TimeSlotDetailAsync;
