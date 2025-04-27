/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TItemTypeResponse } from "@/schema/VinLaudry/item-type.schema";
import { TTableResponse } from "@/types/Table";

export const getAllItemTypes = async (params?: any) => {
    const response = await httpVinLaundry.get<TTableResponse<TItemTypeResponse>>("/item-types", {
        params,
    });
    return { payload: response.payload };
};

export const getItemTypeById = async (id: string) => {
    const response = await httpVinLaundry.get<TItemTypeResponse>(`/item-types/${id}`);
    return response;
};

export const createItemType = async (data: Partial<TItemTypeResponse> & { _token?: string }) => {
    const { _token, ...requestData } = data;
    const accessToken = _token;

    const response = await httpVinLaundry.post(`/item-types`, requestData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response;
};