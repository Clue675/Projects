import { useMemo } from "react";
import "./Container1.css";

const Container1 = ({ diagramIcon1, propFilter, propOpacity }) => {
  const vuesaxlineardiagramStyle = useMemo(() => {
    return {
      filter: propFilter,
      opacity: propOpacity,
    };
  }, [propFilter, propOpacity]);

  return (
    <div className="vuesaxlineardiagram" style={vuesaxlineardiagramStyle}>
      <img className="vuesaxlineardiagram-icon" alt="" src={diagramIcon1} />
    </div>
  );
};

export default Container1;
