/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpHomePlus } from "@/lib/http";
import { TBuildingResponse } from "@/schema/building.schema";
import { TClusterResponse } from "@/schema/cluster.schema";
import { TTableResponse } from "@/types/Table";

// Lấy danh sách tất cả các cụm (cluster)
export const getAllClusters = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TClusterResponse>>(
    `/clusters`,
    {
      params,
    }
  );
  return response;
};

export const getAllClustersInGroup = async (params?: any) => {
  const response = await httpHomePlus.get<TTableResponse<TClusterResponse>>(
    `/clusters?page=1&size=1000`,
    {
      params,
    }
  );
  return response;
};

export const getBuildingsInCluster = async (
  clusterId: string,
  params?: any
) => {
  const response = await httpHomePlus.get<TTableResponse<TBuildingResponse>>(
    `/clusters/${clusterId}/building`,
    {
      params,
    }
  );
  return response;
};

// Lấy thông tin chi tiết của một cụm theo ID
export const getClusterById = async (id: string) => {
  const response = await httpHomePlus.get<TClusterResponse>(`/clusters/${id}`);
  console.log("getClusterById Response:", response);
  return response;
};

// Tạo mới một cụm
export const createCluster = async (data: Partial<TClusterResponse>) => {
  const response = await httpHomePlus.post<TClusterResponse>(`/clusters`, data);
  console.log("createCluster Response:", response);
  return response;
};

// Cập nhật thông tin của một cụm theo ID
export const updateCluster = async (
  id: string,
  data: Partial<TClusterResponse>
) => {
  const response = await httpHomePlus.patch<TClusterResponse>(
    `/clusters/${id}`,
    data
  );
  console.log("updateCluster Response:", response);
  return response;
};

// Xóa một cụm theo ID
export const deleteCluster = async (id: string) => {
  const response = await httpHomePlus.delete(`/clusters/${id}`);
  console.log("deleteCluster Response:", response);
  return response;
};
