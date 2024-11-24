export interface User {
    id: number;
    username: string;
    password: string;
    roles: Role[];
  }
  
  export interface Role {
    id: number;
    name: string;
  }