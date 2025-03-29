import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_BAG_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL_PRODUCTION: z.string(),
  NEXT_PUBLIC_MOCK_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_HOMEPLUS_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_VINWALLET_API_ENDPOINT: z.string(),

});

const isDev = process.env.NODE_ENV === "development";

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_URL: isDev
    ? process.env.NEXT_PUBLIC_URL 
    : process.env.NEXT_PUBLIC_URL_PRODUCTION, 
  NEXT_PUBLIC_BAG_API_ENDPOINT: process.env.NEXT_PUBLIC_BAG_API_ENDPOINT,
  NEXT_PUBLIC_URL_PRODUCTION: process.env.NEXT_PUBLIC_URL_PRODUCTION,
  NEXT_PUBLIC_MOCK_API_ENDPOINT: process.env.NEXT_PUBLIC_MOCK_API_ENDPOINT,
  NEXT_PUBLIC_HOMEPLUS_API_ENDPOINT: process.env.NEXT_PUBLIC_HOMEPLUS_API_ENDPOINT,
  NEXT_PUBLIC_VINWALLET_API_ENDPOINT: process.env.NEXT_PUBLIC_VINWALLET_API_ENDPOINT,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

// Lấy dữ liệu cấu hình từ kết quả parse
const envConfig = configProject.data;
export default envConfig;
