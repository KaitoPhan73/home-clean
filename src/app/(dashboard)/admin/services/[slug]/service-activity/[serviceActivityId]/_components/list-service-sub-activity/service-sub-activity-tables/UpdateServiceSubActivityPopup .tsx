import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
import { TServiceSubActivitiesResponse } from "@/schema/service-sub-activity.schema";
import { FormUpdateServiceSubActivity } from "@/app/(dashboard)/admin/services/[slug]/service-activity/[serviceActivityId]/service-sub-activity/[serviceSubActivityId]/_components/update/form-update-service-sub-activity";

type Props = {
  data: TServiceSubActivitiesResponse;
};

const UpdateServiceSubActivityPopup = ({ data }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Edit className="cursor-pointer" onClick={() => setOpen(true)} />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Cập nhật dịch vụ</DialogTitle>
        <FormUpdateServiceSubActivity initialData={data} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateServiceSubActivityPopup;
