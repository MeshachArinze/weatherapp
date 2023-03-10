import { N, WeatherType } from "./global";
import MenuSection from "./MenuSection";

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

export default Weather;
