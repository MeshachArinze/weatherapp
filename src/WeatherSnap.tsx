import React from "react";
import { N } from "./global";

const WeatherSnap: React.FC = () => {
  const [temperature] = React.useState<number>(N.rand(65, 85));

  return (
    <span className="weather">
      <i className="weather-type fa-duotone fa-sun" />
      <span className="weather-temperature-value">{temperature}</span>
      <span className="weather-temperature-unit">°F</span>
    </span>
  );
};

export default WeatherSnap 