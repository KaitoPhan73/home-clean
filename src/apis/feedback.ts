/* eslint-disable @typescript-eslint/no-explicit-any */ 
"use server";

import { httpHomePlus } from "@/lib/http";
import { TFeedbackResponse } from "@/schema/feedback.schema";
import { TTableResponse } from "@/types/Table";

export const getAllFeedbacks = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TFeedbackResponse>>(
    `/feedbacks`,
    {
      params,
    }
  );
  return response;
};