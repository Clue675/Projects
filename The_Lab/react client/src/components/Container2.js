import { useMemo } from "react";
import "./Container2.css";

const Container2 = ({ graphIconName, propFilter, propOpacity }) => {
  const vuesaxlineargraphStyle = useMemo(() => {
    return {
      filter: propFilter,
      opacity: propOpacity,
    };
  }, [propFilter, propOpacity]);

  return (
    <div className="vuesaxlineargraph" style={vuesaxlineargraphStyle}>
      <img className="vuesaxlineargraph-icon" alt="" src={graphIconName} />
    </div>
  );
};

export default Container2;
