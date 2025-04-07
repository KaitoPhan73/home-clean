/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TTableResponse } from "@/types/Table";

interface Employee {
    id: string;
    employeeCode: string;
    fullName: string;
    role: string;
}

export async function getEmployees(params?: any, token?: string): Promise<Employee[]> {
    try {
        const response = await httpVinLaundry.get<TTableResponse<Employee>>(
            `/employees`,
            {
                params,
                headers: token ? {
                    Authorization: `Bearer ${token}`
                } : undefined
            }
        );
        return response.payload.items || [];
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
}