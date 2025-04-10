/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers";
import PageContainer from "@/components/layout/page-container";
import React, { Suspense } from "react";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import ServiceInHouseTypesTableAction from "@/app/(dashboard)/admin/service-in-house-types/_components/service-in-house-types-tables/service-in-house-types-table-action";
import ServiceInHouseTypesTable from "@/app/(dashboard)/admin/service-in-house-types/_components/service-in-house-types-table";
import { CredenzaCreateServiceInHouseTypes } from "@/app/(dashboard)/admin/service-in-house-types/_components/credenza-create-service-in-house-types";
import { getAllServiceInHouseTypes } from "@/apis/service-in-house-types";
import { getAllHouseTypes } from "@/apis/house-type";
import { getAllServices } from "@/apis/service";

type Props = {
  keyProps: string;
};

const ServiceInHouseTypesIndex = async ({ keyProps }: Props) => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  const tokenCookie = cookieStore.get("accessToken");
  const user = userCookie ? JSON.parse(userCookie.value) : null;
  const token = tokenCookie?.value;
  const groupId = user?.groupId;

  const houseTypes = await getAllHouseTypes({ groupId });
  const services = await getAllServices({ groupId });

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Heading title="Dịch Vụ Trong Loại Nhà" description="Quản lý dịch vụ cho các loại nhà" />
          <CredenzaCreateServiceInHouseTypes 
            services={services.payload.items} 
            houseTypes={houseTypes.payload.items}
            token={token}
          />
        </div>
        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          <ServiceInHouseTypesTable />
        </Suspense>
      </div>
    </PageContainer>
  );
};

export default ServiceInHouseTypesIndex;