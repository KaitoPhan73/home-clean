/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpVinLaundry } from "@/lib/http";
import { TTableResponse } from "@/types/Table";

export interface Employee {
    id: string;
    employeeCode: string;
    fullName: string;
    phone: string;
    email: string;
    position: string | null;
    role: string;
    status: string;
    hireDate: string;
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


export async function getEmployeeById(employeeId: string): Promise<Employee | null> {
    try {
      if (!employeeId) return null;
      
      // Make sure the API endpoint is correct
      const response = await httpVinLaundry.get<{ payload: Employee }>(
        `/employees/${employeeId}`
      );
      
      return response.payload.payload || null;
    } catch (error) {
      console.error(`Error fetching employee with ID ${employeeId}:`, error);
      return null;
    }
  }