export enum UserStatus {
  LoggedIn = "Logged In",
  LoggingIn = "Logging In",
  LoggedOut = "Logged Out",
  LogInError = "Log In Error",
  VerifyingLogIn = "Verifying Log In",
}

export interface IPinDigitProps {
  focused: boolean;
  value: string;
}

export interface IInfoProps {
  id?: string;
}



export interface IMenuSectionProps {
  children: any;
  icon: string;
  id: string;
  scrollable?: boolean;
  title: string;
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

export enum Default {
  PIN = "1234",
}

export enum WeatherType {
  Cloudy = "Cloudy",
  Rainy = "Rainy",
  Stormy = "Stormy",
  Sunny = "Sunny",
}

export interface IPosition {
  left: number | any;
  x: number | any;
}

export const defaultPosition = (): IPosition => ({
  left: 0,
  x: 0,
});

export interface INumberUtility {
  clamp: (min: number, value: number, max: number) => number;
  rand: (min: number, max: number) => number;
}

export const N: INumberUtility = {
  clamp: (min: number, value: number, max: number) =>
    Math.min(Math.max(min, value), max),
  rand: (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min),
};

export interface ITimeUtility {
  format: (date: Date) => string | number;
  formatHours: (hours: string | number) => string | number;
  formatSegment: (segment: string | number) => string | number;
}

export const T: ITimeUtility = {
  format: (date: Date): string | number => {
    const hours: string | number = T.formatHours(date.getHours().valueOf()),
      minutes: string | number = date.getMinutes(),
      seconds: string | number = date.getSeconds();

    return `${hours}:${T.formatSegment(minutes)}`;
  },
  formatHours: (hours: string | number): string | number => {
    return hours % 12 === 0 ? 12 : hours % 12;
  },
  formatSegment: (segment: string | number): string | number => {
    return segment < 10 ? `0${segment}` : segment;
  },
};

export interface ILogInUtility {
  verify: (pin: string) => Promise<boolean>;
}

export const LogInUtility: ILogInUtility = {
  verify: async (pin: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (pin === Default.PIN) {
          resolve(true);
        } else {
          reject(`Invalid pin: ${pin}`);
        }
      }, N.rand(300, 700));
    });
  },
};

export const useCurrentDateEffect = (): Date => {
  const [date, setDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      const update: Date = new Date();

      if (update.getSeconds() !== date.getSeconds()) {
        setDate(update);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [date]);

  return date;
};

export interface IScrollableComponentState {
  grabbing: boolean;
  position: IPosition;
}

export interface IScrollableComponentProps {
  children: any;
  className?: string;
  id?: string;
}
