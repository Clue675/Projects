import { useMemo } from "react";
import "./FrameComponent.css";

const FrameComponent = ({
  frameComponentFrame2,
  text = "see info",
  frameDivBorderRadius,
  frameDivBackgroundColor,
  frameDivDisplay,
  frameDivFlexDirection,
  frameDivPadding,
  frameDivBoxSizing,
  frameDivAlignItems,
  frameDivJustifyContent,
  frameDivPosition,
  frameDivTop,
  frameDivLeft,
}) => {
  const frameDivStyle = useMemo(() => {
    return {
      borderRadius: frameDivBorderRadius,
      backgroundColor: frameDivBackgroundColor,
      display: frameDivDisplay,
      flexDirection: frameDivFlexDirection,
      padding: frameDivPadding,
      boxSizing: frameDivBoxSizing,
      alignItems: frameDivAlignItems,
      justifyContent: frameDivJustifyContent,
      position: frameDivPosition,
      top: frameDivTop,
      left: frameDivLeft,
    };
  }, [
    frameDivBorderRadius,
    frameDivBackgroundColor,
    frameDivDisplay,
    frameDivFlexDirection,
    frameDivPadding,
    frameDivBoxSizing,
    frameDivAlignItems,
    frameDivJustifyContent,
    frameDivPosition,
    frameDivTop,
    frameDivLeft,
  ]);

  return (
    <div className="see-info-parent" style={frameDivStyle}>
      <div className="see-info">{text}</div>
    </div>
  );
};

export default FrameComponent;
