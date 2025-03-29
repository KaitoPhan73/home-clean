export const getAccessToken = async (): Promise<string | null> => {
    if (typeof window !== "undefined") {
      // Chạy trên Client (Trình duyệt): Lấy từ localStorage
      return localStorage.getItem("accessToken") || null;
    } else {
      // Chạy trên Server: Gọi API để lấy token từ Cookie
      try {
        const response = await fetch("/api/auth/token", { method: "GET" });
        const data = await response.json();
        return data.token || null;
      } catch (error) {
        console.error("Lỗi khi lấy token từ server:", error);
        return null;
      }
    }
  };
  