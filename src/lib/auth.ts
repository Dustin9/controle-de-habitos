export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  removeAuthToken();
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export interface UserData {
  id: string;
  email: string;
  name: string;
  questionnaireCompleted?: boolean;
}

export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (data: UserData) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userData', JSON.stringify(data));
};

export const removeUserData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('userData');
}; 