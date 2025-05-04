// GroupDetailAsync component
import { getGroupById } from "@/apis/group";
import React from "react";
import { FormUpdateGroup } from "./form-update-group";
import { getAllServices } from "@/apis/service";
import { getAllAreas } from "@/apis/area";
import { getAllClusters } from "@/apis/cluster";
import { getAllManagers, getAllManagersNoGroup } from "@/apis/manager";

type Props = {
  slug: string;
};

const GroupDetailAsync = async ({ slug }: Props) => {
  const params = { page: 1, size: 10000 };
  const [
    groupResponse,
    serviceResponse,
    areaResponse,
    clusterResponse,
    managerResponse,
    currentManagerResponse,
  ] = await Promise.all([
    getGroupById(slug),
    getAllServices(params),
    getAllAreas(params),
    getAllClusters(params),
    getAllManagersNoGroup(),
    getAllManagers(params),
  ]);

  return (
    <FormUpdateGroup
      initialData={groupResponse.payload}
      services={serviceResponse.payload.items}
      areas={areaResponse.payload.items}
      clusters={clusterResponse.payload.items}
      managers={managerResponse.payload}
      currentManagers={currentManagerResponse.payload.items}
    />
  );
};

export default GroupDetailAsync;
