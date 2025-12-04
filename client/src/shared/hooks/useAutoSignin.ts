// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router';
// import type { UserType } from '../../sdk/types';

// interface UseAutoSigninResult {
//   isLoading: boolean;
//   user: UserType | null;
//   error: string | null;
// }

// export const useAutoSignin = (): UseAutoSigninResult => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState<UserType | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const attemptAutoSignin = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         // Try to get existing session first
//         const currentUser = authClient.getCachedUser();
//         if (currentUser) {
//           setUser(currentUser);
//           setIsLoading(false);
//           return;
//         }

//         // If no cached user, try auto-signin if remember me is enabled
//         if (authClient.hasRememberMe()) {
//           const autoSignedUser = await authClient.tryAutoSignin();
//           if (autoSignedUser) {
//             setUser(autoSignedUser);

//             // Redirect to dashboard if on auth pages
//             const currentPath = window.location.pathname;
//             if (
//               currentPath === '/signin' ||
//               currentPath === '/signup' ||
//               currentPath === '/'
//             ) {
//               navigate('/home/dashboard');
//             }
//           }
//         }
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : 'Auto-signin failed';
//         setError(errorMessage);
//         console.error('Auto-signin error:', err);

//         // Clear remember me on error
//         localStorage.removeItem('rememberMe');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     attemptAutoSignin();
//   }, [navigate]);

//   return {
//     isLoading,
//     user,
//     error,
//   };
// };
