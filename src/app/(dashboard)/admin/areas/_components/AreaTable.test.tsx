import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Import dependencies
import { getAllAreas } from "@/apis/area";
import { searchParamsCache } from "@/lib/searchparams";
import AreaTable from "./area-table";

// Cấu hình Jest nếu cần
jest.useFakeTimers(); // Nếu bạn muốn mock timers

jest.mock("@/apis/area", () => ({
  getAllAreas: jest.fn(),
}));

jest.mock("@/lib/searchparams", () => ({
  searchParamsCache: {
    get: jest.fn(),
  },
}));

jest.mock("@/components/table/data-table", () => ({
  DataTable: jest.fn(() => (
    <div data-testid="mock-data-table">Mock DataTable</div>
  )),
}));

describe("AreaTable Component", () => {
  // Mock data để test
  const mockAreaResponse = {
    payload: {
      items: [
        { id: "1", name: "Area 1", code: "AREA1" },
        { id: "2", name: "Area 2", code: "AREA2" },
      ],
      total: 2,
    },
  };

  beforeEach(() => {
    // Reset mocks trước mỗi test
    jest.clearAllMocks();
  });

  it("renders DataTable with correct props", async () => {
    // Setup mock cho các dependencies
    (searchParamsCache.get as jest.Mock)
      .mockReturnValueOnce("1") // page
      .mockReturnValueOnce("test") // search
      .mockReturnValueOnce("10"); // size

    (getAllAreas as jest.Mock).mockResolvedValue(mockAreaResponse);

    // Render component
    render(await AreaTable());

    // Kiểm tra DataTable được render với đúng props
    const dataTable = screen.getByTestId("mock-data-table");
    expect(dataTable).toBeInTheDocument();

    // Kiểm tra getAllAreas được gọi với đúng filter
    expect(getAllAreas).toHaveBeenCalledWith({
      page: "1",
      size: "10",
      search: "test",
    });
  });

  it("renders DataTable without search when no search param", async () => {
    // Setup mock cho các dependencies
    (searchParamsCache.get as jest.Mock)
      .mockReturnValueOnce("1") // page
      .mockReturnValueOnce(null) // search
      .mockReturnValueOnce("10"); // size

    (getAllAreas as jest.Mock).mockResolvedValue(mockAreaResponse);

    // Render component
    render(await AreaTable());

    // Kiểm tra getAllAreas được gọi với filter không có search
    expect(getAllAreas).toHaveBeenCalledWith({
      page: "1",
      size: "10",
    });
  });

  it("handles API error gracefully", async () => {
    // Mock API throw error
    (getAllAreas as jest.Mock).mockRejectedValue(new Error("API Error"));

    // Kiểm tra xem component có xử lý lỗi không
    await expect(AreaTable()).rejects.toThrow("API Error");
  });
});
