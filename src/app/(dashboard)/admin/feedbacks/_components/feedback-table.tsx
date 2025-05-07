import { DataTable } from "@/components/table/data-table";
import { columns } from "./feedback-tables/columns";
import { searchParamsCache } from "@/lib/searchparams";
import { getAllFeedbacks } from "@/apis/feedback";

const FeedbackTable = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search");
  const size = searchParamsCache.get("size");

  const filters = {
    page,
    size: size,
    ...(search && { search }),
  };
  const feedbackResponse = await getAllFeedbacks(filters);
  const feedbackPayload = feedbackResponse.payload;
  return (
    <div>
      <DataTable
        data={feedbackPayload.items}
        columns={columns}
        totalItems={feedbackPayload.total}
      />
    </div>
  );
};

export default FeedbackTable;
