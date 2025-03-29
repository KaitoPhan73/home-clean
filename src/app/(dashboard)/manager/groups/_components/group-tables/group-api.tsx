import { TGroupResponse } from "@/schema/group.schema";
import { getAllManagers } from "@/apis/manager";
import { getClusterById } from "@/apis/cluster";
import { getAllServices } from "@/apis/service";
import { getAreaById } from "@/apis/area";
import { HttpResponse } from "@/lib/http";
import { TManagerResponse } from "@/schema/manager.schema";
import { TAreaResponse } from "@/schema/area.schema";
import { TClusterResponse } from "@/schema/cluster.schema";
import { TServiceResponse } from "@/schema/service.schema";
import { TTableResponse } from "@/types/Table";

interface GroupDetails {
  areaName: string;
  managerName: string;
  clusterNames: string[];
  serviceNames: string[];
}

export const fetchGroupDetails = async (
  group: TGroupResponse
): Promise<GroupDetails> => {
  const details: GroupDetails = {
    areaName: "Chưa xác định",
    managerName: "Chưa xác định",
    clusterNames: [],
    serviceNames: [],
  };

  try {
    const [areaResponse, managersResponse, clustersResponse, servicesResponse] =
      await Promise.all([
        group.areaId
          ? (getAreaById(group.areaId) as Promise<HttpResponse<TAreaResponse>>)
          : Promise.resolve(null),
        getAllManagers() as Promise<
          HttpResponse<TTableResponse<TManagerResponse>>
        >,
        group.clusterIds?.length
          ? (Promise.all(
              group.clusterIds.map((id: string) => getClusterById(id))
            ) as Promise<HttpResponse<TClusterResponse>[]>)
          : Promise.resolve([]),
        getAllServices() as Promise<
          HttpResponse<TTableResponse<TServiceResponse>>
        >,
      ]);

    if (areaResponse) {
      details.areaName = areaResponse.payload?.name || "Chưa xác định";
    }

    const manager = managersResponse.payload?.items.find(
      (m) => m.id === group.managerId
    );
    details.managerName = manager?.fullName || "Chưa xác định";

    if (clustersResponse.length) {
      details.clusterNames = clustersResponse.map(
        (c) => c.payload?.name || "Không xác định"
      );
    }

    if (group.serviceIds?.length) {
      const allServices = servicesResponse.payload?.items || [];
      details.serviceNames = allServices
        .filter((s) => group.serviceIds.includes(s.id))
        .map((s) => s.name || "Không xác định");
    }
  } catch (error) {
    console.error("Error fetching group details:", error);
  }

  return details;
};
