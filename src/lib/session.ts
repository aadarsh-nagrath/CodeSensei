// Session management utilities

export interface UserSession {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  loginTime: string | null;
}

export const getSession = (): UserSession => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return {
      isLoggedIn: false,
      username: null,
      token: null,
      loginTime: null
    };
  }

  return {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    username: localStorage.getItem('username'),
    token: localStorage.getItem('userToken'),
    loginTime: localStorage.getItem('loginTime')
  };
};

export const setSession = (username: string, token: string) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('username', username);
  localStorage.setItem('userToken', token);
  localStorage.setItem('loginTime', new Date().toISOString());
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginTime');
};

export const isSessionValid = (): boolean => {
  const session = getSession();
  
  if (!session.isLoggedIn || !session.token || !session.loginTime) {
    return false;
  }

  // Check if session is older than 24 hours
  const loginTime = new Date(session.loginTime);
  const now = new Date();
  const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff < 24;
};
