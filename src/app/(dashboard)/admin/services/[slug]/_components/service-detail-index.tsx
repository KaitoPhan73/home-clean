import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="p-0 space-y-6">
        {/* Service Details Section */}
        <div className="bg-white rounded-md shadow-sm p-4">
          <Suspense fallback={<Skeleton className="w-full h-32" />}>
            <ServiceDetailAsync slug={slug} />
          </Suspense>
        </div>

        {/* Related Services Section */}
        <div>
          <Separator className="my-4" />
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

            <TabsContent value="activities" className="mt-4">
              <div className="bg-white rounded-md shadow-sm p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <Heading
                    title="Công việc chính"
                    description="Danh sách các Công việc chính"
                  />
                  <CredenzaCreateServiceActivity />
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <ServiceActivitiesTableInService slug={slug} />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="extra-services" className="mt-4">
              <div className="bg-white rounded-md shadow-sm p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <Heading
                    title="Dịch vụ bổ sung"
                    description="Danh sách các dịch vụ bổ sung"
                  />
                  <CredenzaCreateExtraService />
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <ExtraServiceTableInService slug={slug} />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="options" className="mt-4">
              <div className="bg-white rounded-md shadow-sm p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <Heading
                    title="Lựa chọn"
                    description="Danh sách các lựa chọn"
                  />
                  <CredenzaCreateOption />
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <OptionsTableInService slug={slug} />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="equipment" className="mt-4">
              <div className="bg-white rounded-md shadow-sm p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <Heading
                    title="Trang thiết bị hỗ trợ"
                    description="Danh sách các thiết bị hỗ trợ"
                  />
                  <CredenzaCreateEquipmentSupply />
                </div>
                <Suspense
                  key={keyProps}
                  fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
                >
                  <EquipmentSuppliesTableInService slug={slug} />
                </Suspense>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
};

export default ServiceDetailIndex;