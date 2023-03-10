import { IInfoProps } from "./global";
import Time from "./Time";
import WeatherSnap from "./WeatherSnap";

const Info: React.FC = (props: IInfoProps) => {
  return (
    <div id={props.id} className="info">
      <Time />
      <WeatherSnap />
    </div>
  );
};

export default Info;