/**
 * Debug utilities for EBGreentek admin
 */

export const debugAuth = () => {
  const token = localStorage.getItem('adminToken');
  const refreshToken = localStorage.getItem('adminRefreshToken');
  const adminAuth = localStorage.getItem('adminAuth');
  
  console.group('🔍 Auth Debug');
  console.log('adminToken:', token ? `${token.substring(0, 20)}...` : 'NULL');
  console.log('adminRefreshToken:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'NULL');
  console.log('adminAuth:', adminAuth);
  
  if (token) {
    // Try to decode JWT (basic decode, not verification)
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('JWT Payload:', payload);
        console.log('Expires:', new Date(payload.exp * 1000).toLocaleString());
        console.log('Is Expired:', Date.now() > payload.exp * 1000);
      }
    } catch (e) {
      console.error('Failed to decode JWT:', e);
    }
  }
  
  console.groupEnd();
  
  return {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
    isAuthFlagSet: adminAuth === 'true',
  };
};

// Add to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
}
