export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Sales User';
  }
  
  export interface AuthResponse extends User {
    token: string;
  }