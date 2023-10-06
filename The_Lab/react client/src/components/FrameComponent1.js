import { useMemo } from "react";
import "./FrameComponent1.css";

const FrameComponent1 = ({
  text = "Account purchase",
  vuesaxbulkshoppingCart,
  boolean = true,
  frameDivBoxShadow,
}) => {
  const frameDiv1Style = useMemo(() => {
    return {
      boxShadow: frameDivBoxShadow,
    };
  }, [frameDivBoxShadow]);

  return (
    <div className="account-purchase-parent" style={frameDiv1Style}>
      <div className="account-purchase">{text}</div>
      {boolean && (
        <div className="vuesaxbulkshopping-cart">
          <img
            className="vuesaxbulkshopping-cart-icon"
            alt=""
            src={vuesaxbulkshoppingCart}
          />
        </div>
      )}
    </div>
  );
};

export default FrameComponent1;
