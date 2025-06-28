export interface IUser {
  email: string;
  password?: string;
}

export interface IHeaderProps {
  loggedInUser: string | null;
  handleLogout: () => void;
}

export interface ISidebarProps {
  drawerWidth: number;
}
