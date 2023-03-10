import React, { useState, useEffect, useRef } from "react";
import UserStatusButton from "./UserStatusButton";
import { UserStatus } from "./global";
import Menu from "./Menu";
import MenuSection from "./MenuSection";
import Movies from "./Movies";
import Loading from "./Loading";
import Background from "./Background";
import { AppContext } from "./AppContext";
import Tools from "./Tools";
import Restaurant from "./Restaurant";

enum Default {
  PIN = "1234",
}

enum WeatherType {
  Cloudy = "Cloudy",
  Rainy = "Rainy",
  Stormy = "Stormy",
  Sunny = "Sunny",
}

interface IPosition {
  left: number;
  x: number;
}

const defaultPosition = (): IPosition => ({
  left: 0,
  x: 0,
});

interface INumberUtility {
  clamp: (min: number, value: number, max: number) => number;
  rand: (min: number, max: number) => number;
}

const N: INumberUtility = {
  clamp: (min: number, value: number, max: number) =>
    Math.min(Math.max(min, value), max),
  rand: (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min),
};

interface ITimeUtility {
  format: (date: Date) => string | number;
  formatHours: (hours: string | number) => string | number;
  formatSegment: (segment: string | number) => string | number;
}

const T: ITimeUtility = {
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

interface ILogInUtility {
  verify: (pin: string) => Promise<boolean>;
}

const LogInUtility: ILogInUtility = {
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

const useCurrentDateEffect = (): Date => {
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

interface IScrollableComponentState {
  grabbing: boolean;
  position: IPosition;
}

interface IScrollableComponentProps {
  children: any;
  className?: string;
  id?: string;
}

const ScrollableComponent: React.FC<IScrollableComponentProps> = (
  props: IScrollableComponentProps
) => {
  const ref: React.MutableRefObject<HTMLDivElement | null> =
    React.useRef<HTMLDivElement>(null);

  const [state, setStateTo] = React.useState<IScrollableComponentState>({
    grabbing: false,
    position: defaultPosition(),
  });

  const handleOnMouseDown = (e: any): void => {
    setStateTo({
      ...state,
      grabbing: true,
      position: {
        x: e.clientX,
        left: ref?.current?.scrollLeft,
      },
    });
  };

  const handleOnMouseMove = (e: any): void => {
    if (state.grabbing) {
      const left: number = Math.max(
        0,
        state.position.left + (state.position.x - e.clientX)
      );

      ref.current.scrollLeft = left;
    }
  };

  const handleOnMouseUp = (): void => {
    if (state.grabbing) {
      setStateTo({ ...state, grabbing: false });
    }
  };

  function classNames(
    arg0: string,
    className: string | undefined
  ): string | undefined {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      ref={ref}
      className={classNames("scrollable-component", props.className)}
      id={props.id}
      onMouseDown={handleOnMouseDown}
      onMouseMove={handleOnMouseMove}
      onMouseUp={handleOnMouseUp}
      onMouseLeave={handleOnMouseUp}
    >
      {props.children}
    </div>
  );
};

const WeatherSnap: React.FC = () => {
  const [temperature] = React.useState<number>(N.rand(65, 85));

  return (
    <span className="weather">
      <i className="weather-type" className="fa-duotone fa-sun" />
      <span className="weather-temperature-value">{temperature}</span>
      <span className="weather-temperature-unit">°F</span>
    </span>
  );
};

const Reminder: React.FC = () => {
  return (
    <div className="reminder">
      <div className="reminder-icon">
        <i className="fa-regular fa-bell" />
      </div>
      <span className="reminder-text">
        Extra cool people meeting <span className="reminder-time">10AM</span>
      </span>
    </div>
  );
};

const Time: React.FC = () => {
  const date: Date = useCurrentDateEffect();

  return <span className="time">{T.format(date)}</span>;
};

interface IInfoProps {
  id?: string;
}

const Info: React.FC = (props: IInfoProps) => {
  return (
    <div id={props.id} className="info">
      <Time />
      <WeatherSnap />
    </div>
  );
};

interface IPinDigitProps {
  focused: boolean;
  value: string;
}

const PinDigit: React.FC<IPinDigitProps> = (props: IPinDigitProps) => {
  const [hidden, setHiddenTo] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.value) {
      const timeout: NodeJS.Interval = setTimeout(() => {
        setHiddenTo(true);
      }, 500);

      return () => {
        setHiddenTo(false);

        clearTimeout(timeout);
      };
    }
  }, [props.value]);

  function classNames(
    arg0: string,
    arg1: { focused: boolean; hidden: boolean }
  ): string | undefined {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      className={classNames("app-pin-digit", {
        focused: props.focused,
        hidden,
      })}
    >
      <span className="app-pin-digit-value">{props.value || ""}</span>
    </div>
  );
};

const Pin: React.FC = () => {
  const { userStatus, setUserStatusTo } = React.useContext(AppContext);

  const [pin, setPinTo] = React.useState<string>("");

  const ref: React.MutableRefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (
      userStatus === UserStatus.LoggingIn ||
      userStatus === UserStatus.LogInError
    ) {
      ref.current.focus();
    } else {
      setPinTo("");
    }
  }, [userStatus]);

  React.useEffect(() => {
    if (pin.length === 4) {
      const verify = async (): Promise<void> => {
        try {
          setUserStatusTo(UserStatus.VerifyingLogIn);

          if (await LogInUtility.verify(pin)) {
            setUserStatusTo(UserStatus.LoggedIn);
          }
        } catch (err) {
          console.error(err);

          setUserStatusTo(UserStatus.LogInError);
        }
      };

      verify();
    }

    if (userStatus === UserStatus.LogInError) {
      setUserStatusTo(UserStatus.LoggingIn);
    }
  }, [pin]);

  const handleOnClick = (): void => {
    ref.current.focus();
  };

  const handleOnCancel = (): void => {
    setUserStatusTo(UserStatus.LoggedOut);
  };

  const handleOnChange = (e: any): void => {
    if (e.target.value.length <= 4) {
      setPinTo(e.target.value.toString());
    }
  };

  const getCancelText = (): JSX.Element => {
    return (
      <span id="app-pin-cancel-text" onClick={handleOnCancel}>
        Cancel
      </span>
    );
  };

  const getErrorText = () => {
    if (userStatus === UserStatus.LogInError)
      <span id="app-pin-error-text">Invalid</span>;
  };

  return (
    <div id="app-pin-wrapper">
      <input
        disabled={
          userStatus !== UserStatus.LoggingIn &&
          userStatus !== UserStatus.LogInError
        }
        id="app-pin-hidden-input"
        maxLength={4}
        ref={ref}
        type="number"
        value={pin}
        onChange={handleOnChange}
      />
      <div id="app-pin" onClick={handleOnClick}>
        <PinDigit focused={pin.length === 0} value={pin[0]} />
        <PinDigit focused={pin.length === 1} value={pin[1]} />
        <PinDigit focused={pin.length === 2} value={pin[2]} />
        <PinDigit focused={pin.length === 3} value={pin[3]} />
      </div>
      <h3 id="app-pin-label">
        Enter PIN <span></span> {getErrorText()} {getCancelText()}
      </h3>
    </div>
  );
};

export interface IMenuSectionProps {
  children: any;
  icon: string;
  id: string;
  scrollable?: boolean;
  title: string;
}

<MenuSection children={undefined} icon={""} id={""} title={""} />;

const QuickNav: React.FC = () => {
  const getItems = (): JSX.Element[] => {
    return [
      {
        id: 1,
        label: "Weather",
      },
      {
        id: 2,
        label: "Food",
      },
      {
        id: 3,
        label: "Apps",
      },
      {
        id: 4,
        label: "Movies",
      },
    ].map((item: any) => {
      return (
        <div key={item.id} className="quick-nav-item clear-button">
          <span className="quick-nav-item-label">{item.label}</span>
        </div>
      );
    });
  };

  return <ScrollableComponent id="quick-nav">{getItems()}</ScrollableComponent>;
};

const Weather: React.FC = () => {
  const getDays = (): JSX.Element[] => {
    return [
      {
        id: 1,
        name: "Mon",
        temperature: N.rand(60, 80),
        weather: WeatherType.Sunny,
      },
      {
        id: 2,
        name: "Tues",
        temperature: N.rand(60, 80),
        weather: WeatherType.Sunny,
      },
      {
        id: 3,
        name: "Wed",
        temperature: N.rand(60, 80),
        weather: WeatherType.Cloudy,
      },
      {
        id: 4,
        name: "Thurs",
        temperature: N.rand(60, 80),
        weather: WeatherType.Rainy,
      },
      {
        id: 5,
        name: "Fri",
        temperature: N.rand(60, 80),
        weather: WeatherType.Stormy,
      },
      {
        id: 6,
        name: "Sat",
        temperature: N.rand(60, 80),
        weather: WeatherType.Sunny,
      },
      {
        id: 7,
        name: "Sun",
        temperature: N.rand(60, 80),
        weather: WeatherType.Cloudy,
      },
    ].map((day: any) => {
      const getIcon: () =>
        | "fa-duotone fa-clouds"
        | "fa-duotone fa-cloud-drizzle"
        | "fa-duotone fa-cloud-bolt"
        | "fa-duotone fa-sun" = () => {
        switch (day.weather) {
          case WeatherType.Cloudy:
            return "fa-duotone fa-clouds";
          case WeatherType.Rainy:
            return "fa-duotone fa-cloud-drizzle";
          case WeatherType.Stormy:
            return "fa-duotone fa-cloud-bolt";
          case WeatherType.Sunny:
            return "fa-duotone fa-sun";
        }
      };

      function classNames(
        arg0: string,
        arg1: string,
        arg2: any
      ): string | undefined {
        throw new Error("Function not implemented.");
      }

      return (
        <div key={day.id} className="day-card">
          <div className="day-card-content">
            <span className="day-weather-temperature">
              {day.temperature}
              <span className="day-weather-temperature-unit">°F</span>
            </span>
            <i
              className={classNames(
                "day-weather-icon",
                getIcon(),
                day.weather.toLowerCase()
              )}
            />
            <span className="day-name">{day.name}</span>
          </div>
        </div>
      );
    });
  };
  return (
    <MenuSection
      icon="fa-solid fa-sun"
      id="weather-section"
      scrollable
      title="How's it look out there?"
    >
      {getDays()}
    </MenuSection>
  );
};


<><Tools /><Restaurant /><>
  <Movies />
  <UserStatusButton icon={""} id={""} userStatus={undefined} />
  <Menu />
</></>;

<>
  <>
    <Background />
    <Loading />
  </>
  <AppContext />
</>;

const App: React.FC = () => {
  const [userStatus, setUserStatusTo] = React.useState<UserStatus>(
    UserStatus.LoggedOut
  );

  const getStatusClass = (): string => {
    return userStatus.replace(/\s+/g, "-").toLowerCase();
  };

  return (
    <AppContext.Provider value={{ userStatus, setUserStatusTo }}>
      <div id="app" className={getStatusClass()}>
        <Info id="app-info" />
        <Pin />
        <Menu />
        <Background />
        <div id="sign-in-button-wrapper">
          <UserStatusButton
            icon="fa-solid fa-arrow-right-to-arc"
            id="sign-in-button"
            userStatus={UserStatus.LoggingIn}
          />
        </div>
        <Loading />
      </div>
    </AppContext.Provider>
  );
};

export default App;
