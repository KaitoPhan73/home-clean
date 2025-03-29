import { getEquipmentSupplyById } from "@/apis/equipment-supply";
import { FormUpdateEquipmentSupply } from "@/app/(dashboard)/admin/services/[slug]/equipment-supply/[equipmentSupplyId]/_components/update/form-update-equipment-supply";
import React from "react";

type Props = {
  slug: string;
};
const EquipmentSupplyDetailAsync = async ({ slug }: Props) => {
  const response = await getEquipmentSupplyById(slug);

  return <FormUpdateEquipmentSupply initialData={response.payload} />;
};
 
export default EquipmentSupplyDetailAsync;
 