import { useCurrentDateEffect, T } from "./global";

const Time: React.FC = () => {
  const date: Date = useCurrentDateEffect();

  return <span className="time">{T.format(date)}</span>;
};

export default Time;
