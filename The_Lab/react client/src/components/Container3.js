import { useMemo } from "react";
import "./Container3.css";

const Container3 = ({ chartIcon, propFilter, propOpacity }) => {
  const vuesaxlinearchart2Style = useMemo(() => {
    return {
      filter: propFilter,
      opacity: propOpacity,
    };
  }, [propFilter, propOpacity]);

  return (
    <div className="vuesaxlinearchart-2" style={vuesaxlinearchart2Style}>
      <img className="vuesaxlinearchart-2-icon" alt="" src={chartIcon} />
    </div>
  );
};

export default Container3;
