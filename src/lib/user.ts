// utils/user.ts
export function getUserFromCookie() {
    try {
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));
      
      if (userCookie) {
        const userValue = userCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(userValue));
      }
      return null;
    } catch (error) {
      console.error('Error getting user from cookie:', error);
      return null;
    }
  }