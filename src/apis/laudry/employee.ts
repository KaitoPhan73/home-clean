/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TTableResponse } from "@/types/Table";

// export interface Employee {
//     id: string;
//     employeeCode: string;
//     fullName: string;
//     phone: string;
//     email: string;
//     position: string | null;
//     role: string;
//     status: string;
//     hireDate: string;
// }

export interface EmployeRealTimeStatus {
    id: string;
    status: string;
    staffName: string;
    staffCode: string;
    lastUpdated: string;
}


export async function getEmployeesRealTimeStatus(params?: any): Promise<EmployeRealTimeStatus[]> {
    try {
        const response = await httpVinLaundry.get<any>(`/employees/real-time-status`, {
            params,
        });
        console.log("Raw API response:", response); // Debug the raw response

        // Handle flat array, payload array, or payload.items
        let fetchedEmployees: EmployeRealTimeStatus[];
        if (Array.isArray(response)) {
            fetchedEmployees = response;
        } else if (Array.isArray(response.payload)) {
            fetchedEmployees = response.payload; // Use payload directly if it's an array
        } else {
            fetchedEmployees = response.payload?.items || [];
        }

        console.log("Processed employees:", fetchedEmployees); // Debug the processed data
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

        // Make sure the API endpoint is correct
        const response = await httpVinLaundry.get<{ payload: EmployeRealTimeStatus }>(
            `/employees/${employeeId}`
        );

        return response.payload.payload || null;
    } catch (error) {
        console.error(`Error fetching employee with ID ${employeeId}:`, error);
        return null;
    }
}