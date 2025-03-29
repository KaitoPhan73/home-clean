// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/hooks/useAuth.ts
// import { useState, useEffect, useCallback } from 'react';
// import { httpHomePlus } from '@/lib/http';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   groupId: string;
//   role: string;
// }

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

// export const useAuth = () => {
//   const [authState, setAuthState] = useState<AuthState>({
//     user: null,
//     isAuthenticated: false,
//     isLoading: true,
//     error: null,
//   });

//   // Kiểm tra trạng thái đăng nhập
//   const checkAuthStatus = useCallback(async () => {
//     setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
//     try {
//       // Kiểm tra token trong localStorage
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         throw new Error('Chưa đăng nhập');
//       }
      
//       // Lấy thông tin user từ localStorage
//       const storedUserInfo = localStorage.getItem('userInfo');
//       if (!storedUserInfo) {
//         throw new Error('Không tìm thấy thông tin người dùng');
//       }
      
//       const userInfo = JSON.parse(storedUserInfo);
      
//       // Kiểm tra xem token có hiệu lực hay không
//       // Có thể thêm một API call để validate token nếu cần
//       // await httpHomePlus.get('/auth/validate-token');
      
//       setAuthState({
//         user: userInfo,
//         isAuthenticated: true,
//         isLoading: false,
//         error: null,
//       });
      
//     } catch (error: any) {
//       console.error('Auth check failed:', error);
      
//       // Xóa token và userInfo khỏi localStorage nếu không hợp lệ
//       localStorage.removeItem('token');
//       localStorage.removeItem('userInfo');
      
//       setAuthState({
//         user: null,
//         isAuthenticated: false,
//         isLoading: false,
//         error: error.message || 'Lỗi xác thực',
//       });
//     }
//   }, []);

//   // Đăng nhập
//   const login = async (email: string, password: string) => {
//     setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
//     try {
//       // Gọi API đăng nhập
//       const response = await httpHomePlus.post('/auth/login', {
//         email,
//         password,
//       });
      
//       const { token, user } = response.payload;
      
//       // Lưu token và thông tin user vào localStorage
//       localStorage.setItem('token', token);
//       localStorage.setItem('userInfo', JSON.stringify(user));
      
//       setAuthState({
//         user,
//         isAuthenticated: true,
//         isLoading: false,
//         error: null,
//       });
      
//       return user;
      
//     } catch (error: any) {
//       console.error('Login failed:', error);
      
//       setAuthState(prev => ({
//         ...prev,
//         isLoading: false,
//         error: error.response?.data?.message || 'Đăng nhập thất bại',
//       }));
      
//       throw error;
//     }
//   };

//   // Đăng xuất
//   const logout = async () => {
//     setAuthState(prev => ({ ...prev, isLoading: true }));
    
//     try {
//       // Gọi API đăng xuất nếu cần
//       // await httpHomePlus.post('/auth/logout');
      
//       // Xóa token và userInfo khỏi localStorage
//       localStorage.removeItem('token');
//       localStorage.removeItem('userInfo');
      
//       setAuthState({
//         user: null,
//         isAuthenticated: false,
//         isLoading: false,
//         error: null,
//       });
      
//     } catch (error: any) {
//       console.error('Logout failed:', error);
      
//       // Vẫn xóa token và userInfo khỏi localStorage
//       localStorage.removeItem('token');
//       localStorage.removeItem('userInfo');
      
//       setAuthState({
//         user: null,
//         isAuthenticated: false,
//         isLoading: false,
//         error: error.message || 'Đăng xuất thất bại',
//       });
//     }
//   };

//   // Kiểm tra trạng thái đăng nhập khi component mount
//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   return {
//     ...authState,
//     login,
//     logout,
//     refreshAuth: checkAuthStatus,
//   };
// };