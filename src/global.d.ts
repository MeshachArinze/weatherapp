export enum UserStatus {
  LoggedIn = "Logged In",
  LoggingIn = "Logging In",
  LoggedOut = "Logged Out",
  LogInError = "Log In Error",
  VerifyingLogIn = "Verifying Log In",
}

export interface IUserStatusButton {
  icon: string;
  id: string;
  userStatus: UserStatus;
}

export interface IAppContext {
  userStatus: UserStatus;
  setUserStatusTo: (status: UserStatus) => void;
}

export interface IMenuSectionProps {
  children: any;
  icon: string;
  id: string;
  scrollable?: boolean;
  title: string;
}


export interface IScrollableComponentProps {
  children: any;
  className?: string;
  id?: string;
}