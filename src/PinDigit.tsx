import React from "react";
import { IPinDigitProps } from "./global";

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


export default PinDigit