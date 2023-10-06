import { useMemo } from "react";
import "./FrameComponent2.css";

const FrameComponent2 = ({
  text = "can’t find something? search it here!",
  vuesaxlinearsearchNormal,
  boolean = true,
  frameDivPadding,
}) => {
  const frameDiv2Style = useMemo(() => {
    return {
      padding: frameDivPadding,
    };
  }, [frameDivPadding]);

  return (
    <div className="frame-root" style={frameDiv2Style}>
      <div className="cant-find-something-search-i-wrapper">
        <div className="cant-find-something">{text}</div>
      </div>
      {boolean && (
        <div className="vuesaxlinearsearch-normal">
          <img
            className="vuesaxlinearsearch-normal-icon"
            alt=""
            src={vuesaxlinearsearchNormal}
          />
        </div>
      )}
    </div>
  );
};

export default FrameComponent2;
