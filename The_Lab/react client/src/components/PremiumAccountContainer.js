import FrameComponent1 from "./FrameComponent1";
import ContainerCard from "./ContainerCard";
import "./PremiumAccountContainer.css";

const PremiumAccountContainer = () => {
  return (
    <div className="frame-parent7">
      <div className="special-premium-account-wrapper">
        <b className="special-premium-account">Special premium account!</b>
      </div>
      <div className="with-a-special-premium-account-wrapper">
        <div className="with-a-special-container">
          <p className="with-a-special">
            With a special premium account, you can do very interesting things!
          </p>
          <p className="with-a-special">
            By purchasing this account, special features will be activated for
            you that you will be amazed to see!
          </p>
        </div>
      </div>
      <div className="instance-parent">
        <FrameComponent1
          text="Account purchase"
          vuesaxbulkshoppingCart="/vuesaxbulkshoppingcart.svg"
          boolean
          frameDivBoxShadow="8.74046516418457px 9.711627960205078px 18.45px rgba(61, 73, 100, 0.3) inset"
        />
        <ContainerCard
          text="View features"
          vuesaxbulkflash="/vuesaxbulkflash.svg"
          boolean
        />
      </div>
    </div>
  );
};

export default PremiumAccountContainer;
