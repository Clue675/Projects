import { useMemo } from "react";
import "./ContainerCardFormFilter1.css";

const ContainerCardFormFilter1 = ({ elementText, propFilter, propOpacity }) => {
  const vuesaxboldelement4Style = useMemo(() => {
    return {
      filter: propFilter,
      opacity: propOpacity,
    };
  }, [propFilter, propOpacity]);

  return (
    <div className="vuesaxboldelement-4" style={vuesaxboldelement4Style}>
      <img className="vuesaxboldelement-4-icon" alt="" src={elementText} />
    </div>
  );
};

export default ContainerCardFormFilter1;
