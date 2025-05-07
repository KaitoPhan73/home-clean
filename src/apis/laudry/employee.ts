/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TEmployeeLaundryResponse, TProgressEmployeeResponse, TUpdateEmployeeRequest } from "@/schema/VinLaudry/employee.schema";
import { TTableResponse } from "@/types/Table";

export interface EmployeRealTimeStatus {
    id: string;
    status: string;
    staffName: string;
    staffCode: string;
    lastUpdated: string;
}

export const getAllEmployees = async (params?: any, accessToken?: string) => {
    const response = await httpVinLaundry.get<TTableResponse<TEmployeeLaundryResponse>>("/employees", {
        params,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return { payload: response.payload };
};

export const getProgressEmployeeById = async (id: string) => {
    const response = await httpVinLaundry.get<TProgressEmployeeResponse>(`/employees/${id}/task-in-progress`);
    return response;
};

export async function getEmployeesRealTimeStatus(params?: any): Promise<EmployeRealTimeStatus[]> {
    try {
        const response = await httpVinLaundry.get<any>(`/employees/real-time-status`, {
            params,
        });
        let fetchedEmployees: EmployeRealTimeStatus[];
        if (Array.isArray(response)) {
            fetchedEmployees = response;
        } else if (Array.isArray(response.payload)) {
            fetchedEmployees = response.payload;
        } else {
            fetchedEmployees = response.payload?.items || [];
        }

        // console.log("Processed employees:", fetchedEmployees);
        return fetchedEmployees;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
}

export async function updateEmployeesRealTimeStatus(params?: any, token?: string): Promise<EmployeRealTimeStatus[]> {
    try {
        const response = await httpVinLaundry.put<TTableResponse<EmployeRealTimeStatus>>(
            `/employees/real-time-status`,
            {
                params,
                headers: token ? {
                    Authorization: `Bearer ${token}`
                } : undefined
            }
        );
        return response.payload.items || [];
    } catch (error) {
        console.error("Error fetching employees real-time status:", error);
        throw error;
    }
}

export async function getEmployeeById(employeeId: string): Promise<EmployeRealTimeStatus | null> {
    try {
        if (!employeeId) return null;
        const response = await httpVinLaundry.get<{ payload: EmployeRealTimeStatus }>(
            `/employees/${employeeId}`
        );

        return response.payload.payload || null;
    } catch (error) {
        console.error(`Error fetching employee with ID ${employeeId}:`, error);
        return null;
    }
}

export const getEmployeeProfileById = async (
    id: string,
    accessToken?: string
) => {
    const response = await httpVinLaundry.get<TEmployeeLaundryResponse>(
        `/employees/${id}`,
        {
            headers: accessToken ? {
                Authorization: `Bearer ${accessToken}`
            } : undefined
        }
    );
    return response;
};

export const createEmployee = async (data: Partial<TEmployeeLaundryResponse> & { _token?: string }) => {
    const { _token, ...requestData } = data;
    const accessToken = _token;

    const response = await httpVinLaundry.post<TEmployeeLaundryResponse>(
        `/employees`,
        requestData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }
    );
    return response;
};

export const updateEmployee = async (id: string, data: TUpdateEmployeeRequest, accessToken?: string | undefined) => {
    const response = await httpVinLaundry.put<TEmployeeLaundryResponse>(
        `/employees/${id}`,
        data
    );
    return response;
};
