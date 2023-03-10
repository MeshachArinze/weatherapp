import React, { useState, useEffect, useRef } from "react";
import UserStatusButton from "./UserStatusButton";
import { UserStatus } from "./global";
import Menu from "./Menu";
import MenuSection from "./MenuSection";
import Movies from "./Movies";
import Loading from "./Loading";
import Background from "./Background";
import { AppContext } from "./AppContext";

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

const Tools: React.FC = () => {
  const getTools = (): JSX.Element[] => {
    return [
      {
        icon: "fa-solid fa-cloud-sun",
        id: 1,
        image:
          "https://images.unsplash.com/photo-1492011221367-f47e3ccd77a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHdlYXRoZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        label: "Weather",
        name: "Cloudly",
      },
      {
        icon: "fa-solid fa-calculator-simple",
        id: 2,
        image:
          "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2FsY3VsYXRvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        label: "Calc",
        name: "Mathio",
      },
      {
        icon: "fa-solid fa-piggy-bank",
        id: 3,
        image:
          "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YmFua3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        label: "Bank",
        name: "Cashy",
      },
      {
        icon: "fa-solid fa-plane",
        id: 4,
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWlycGxhbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        label: "Travel",
        name: "Fly-er-io-ly",
      },
      {
        icon: "fa-solid fa-gamepad-modern",
        id: 5,
        image:
          "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dmlkZW8lMjBnYW1lc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        label: "Games",
        name: "Gamey",
      },
      {
        icon: "fa-solid fa-video",
        id: 6,
        image:
          "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHZpZGVvJTIwY2hhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        label: "Video Chat",
        name: "Chatty",
      },
    ].map((tool: any) => {
      const styles: React.CSSProperties = {
        backgroundImage: `url(${tool.image})`,
      };

      function classNames(icon: any, arg1: string): string | undefined {
        throw new Error("Function not implemented.");
      }

      return (
        <div key={tool.id} className="tool-card">
          <div
            className="tool-card-background background-image"
            style={styles}
          />
          <div className="tool-card-content">
            <div className="tool-card-content-header">
              <span className="tool-card-label">{tool.label}</span>
              <span className="tool-card-name">{tool.name}</span>
            </div>
            <i className={classNames(tool.icon, "tool-card-icon")} />
          </div>
        </div>
      );
    });
  };

  return (
    <MenuSection
      icon="fa-solid fa-toolbox"
      id="tools-section"
      title="What's Appening?"
    >
      {getTools()}
    </MenuSection>
  );
};

const Restaurants: React.FC = () => {
  const getRestaurants = (): JSX.Element[] => {
    return [
      {
        desc: "The best burgers in town",
        id: 1,
        image:
          "https://images.unsplash.com/photo-1606131731446-5568d87113aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YnVyZ2Vyc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        title: "Burgers",
      },
      {
        desc: "The worst ice-cream around",
        id: 2,
        image:
          "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aWNlJTIwY3JlYW18ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        title: "Ice Cream",
      },
      {
        desc: "This 'Za be gettin down",
        id: 3,
        image:
          "https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGl6emF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        title: "Pizza",
      },
      {
        desc: "BBQ ain't need no rhyme",
        id: 4,
        image:
          "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YmFyYmVxdWV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        title: "BBQ",
      },
    ].map((restaurant: any) => {
      const styles: React.CSSProperties = {
        backgroundImage: `url(${restaurant.image})`,
      };

      return (
        <div
          key={restaurant.id}
          className="restaurant-card background-image"
          style={styles}
        >
          <div className="restaurant-card-content">
            <div className="restaurant-card-content-items">
              <span className="restaurant-card-title">{restaurant.title}</span>
              <span className="restaurant-card-desc">{restaurant.desc}</span>
            </div>
          </div>
        </div>
      );
    });
  };
  return (
    <MenuSection
      icon="fa-regular fa-pot-food"
      id="restaurants-section"
      title="Get it delivered!"
    >
      {getRestaurants()}
    </MenuSection>
  );
};

<>
  <Movies />
  <UserStatusButton icon={""} id={""} userStatus={undefined} />
  <Menu />
</>;

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
