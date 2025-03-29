import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Heading } from "@/components/ui/headling";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ServiceDetailAsync from "./update/service-detail-async";
import ServiceActivitiesTableInService from "@/app/(dashboard)/admin/services/[slug]/_components/list-service-activities-in-service/service-activities-table-in-service";
import ExtraServiceTableInService from "@/app/(dashboard)/admin/services/[slug]/_components/list-extra-service-in-services/extra-services-table-in-service";
import EquipmentSuppliesTableInService from "@/app/(dashboard)/admin/services/[slug]/_components/list-equipment-supplies-in-services/extra-services-table-in-service";
import OptionsTableInService from "@/app/(dashboard)/admin/services/[slug]/_components/list-options-in-services/options-table-in-service";
import { CredenzaCreateEquipmentSupply } from "@/app/(dashboard)/admin/services/[slug]/_components/list-equipment-supplies-in-services/credenza-create-equipment-supply";
import { CredenzaCreateOption } from "@/app/(dashboard)/admin/services/[slug]/_components/list-options-in-services/credenza-create-option";
import { CredenzaCreateExtraService } from "@/app/(dashboard)/admin/services/[slug]/_components/list-extra-service-in-services/credenza-create-extra-service";
import { CredenzaCreateServiceActivity } from "@/app/(dashboard)/admin/services/[slug]/_components/list-service-activities-in-service/credenza-create-service-activity";

type Props = {
  slug: string;
  keyProps: string;
};
const ServiceDetailIndex = ({ slug, keyProps }: Props) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-12 md:grid-cols-6 lg:grid-cols-12 gap-4 p-4">
        <Card className="p-4 col-span-12 md:col-span-12 lg:col-span-12">
          <Suspense fallback={<Skeleton className=" w-full h-full" />}>
            <ServiceDetailAsync slug={slug} />
          </Suspense>
        </Card>

        <div className="col-span-12">
          <Separator />
          <div className="py-4">
            <Heading
              title="Những dịch vụ liên quan"
              description="Các danh sách dịch vụ"
            />
          </div>

          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="activities">Công việc chính</TabsTrigger>
              <TabsTrigger value="extra-services">Dịch vụ bổ sung</TabsTrigger>
              <TabsTrigger value="options">Lựa chọn</TabsTrigger>
              <TabsTrigger value="equipment">Trang thiết bị hỗ trợ</TabsTrigger>
            </TabsList>

            <TabsContent value="activities">
              <Card className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Heading
                    title="Công việc chính"
                    description="Danh sách các Công việc chính"
                  />
                  <div className="flex justify-end">
                    <CredenzaCreateServiceActivity  />
                  </div>
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <ServiceActivitiesTableInService slug={slug} />
                </Suspense>
              </Card>
            </TabsContent>

            <TabsContent value="extra-services">
              <Card className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Heading
                    title="Dịch vụ bổ sung"
                    description="Danh sách các dịch vụ bổ sung"
                  />
                  <div className="flex justify-end">
                    <CredenzaCreateExtraService  />
                  </div>
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <ExtraServiceTableInService slug={slug} />
                </Suspense>
              </Card>
            </TabsContent>

            <TabsContent value="options">
              <Card className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Heading
                    title="Lựa chọn"
                    description="Danh sách các lựa chọn"
                  />
                  <div className="flex justify-end">
                    <CredenzaCreateOption />
                  </div>
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <OptionsTableInService slug={slug} />
                </Suspense>
              </Card>
            </TabsContent>

            <TabsContent value="equipment">
              <Card className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Heading
                    title="Trang thiết bị hỗ trợ"
                    description="Danh sách các thiết bị hỗ trợ"
                  />
                  <div className="flex justify-end">
                    <CredenzaCreateEquipmentSupply />
                  </div>
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <EquipmentSuppliesTableInService slug={slug} />
                </Suspense>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default ServiceDetailIndex;
