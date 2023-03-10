import React, { useState, useEffect, useRef } from "react";
import UserStatusButton from "./UserStatusButton";
import { LogInUtility, N, UserStatus, WeatherType } from "./global";
import Menu from "./Menu";
import MenuSection from "./MenuSection";
import Movies from "./Movies";
import Loading from "./Loading";
import Background from "./Background";
import { AppContext } from "./AppContext";
import Tools from "./Tools";
import Restaurant from "./Restaurant";
import ScrollableComponent from "./Scrollable";
import Time from "./Time";
import PinDigit from "./PinDigit";
import Pin from "./Pin";
import WeatherSnap from "./WeatherSnap";
import Reminder from "./Reminder";
import QuickNav from "./QuickNav";
import Info from "./Info";
import Weather from "./Weather";

<>
  <WeatherSnap />
  <Reminder />
  <Time />
</>;

<>
  <PinDigit focused={false} value={""} />
  <Pin />
</>;

<MenuSection children={undefined} icon={""} id={""} title={""} />;

<><QuickNav /><Weather /><>
  <Tools />
  <Restaurant />
  <>
    <Movies />
    <UserStatusButton icon={""} id={""} userStatus={''} />
    <Menu />
  </>
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
        <Info  />
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
