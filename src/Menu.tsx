import React from "react";
import UserStatusButton from "./UserStatusButton";
import { UserStatus } from "./global";
import Movies from "./Movies";
import Reminder from "./Reminder";
import Restaurants from "./Restaurant";
import Tools from "./Tools";
import Info from "./Info";
import QuickNav from "./QuickNav";
import Weather from "./Weather";

const Menu: React.FC = () => {
  return (
    <div id="app-menu">
      <div id="app-menu-content-wrapper">
        <div id="app-menu-content">
          <div id="app-menu-content-header">
            <div className="app-menu-content-header-section">
              <Info  />
              <Reminder />
            </div>
            <div className="app-menu-content-header-section">
              <UserStatusButton
                icon="fa-solid fa-arrow-right-from-arc"
                id="sign-out-button"
                userStatus={UserStatus.LoggedOut}
              />
            </div>
          </div>
          <QuickNav />
          <a
            id="youtube-link"
            className="clear-button"
            href="https://www.youtube.com/c/Hyperplexed"
            target="_blank"
          >
            <i className="fa-brands fa-youtube" />
            <span>Hyperplexed</span>
          </a>
          <Weather />
          <Restaurants />
          <Tools />
          <Movies />
        </div>
      </div>
    </div>
  );
};

export default Menu;