import FrameComponent2 from "./FrameComponent2";
import ContainerCard from "./ContainerCard";
import "./DashboardContainer.css";

const DashboardContainer = () => {
  return (
    <div className="frame-parent5">
      <div className="frame-parent6">
        <div className="dashboard-container">
          <b className="dashboard1">Dashboard</b>
        </div>
        <div className="see-your-account-information-i-wrapper">
          <div className="see-your-account">
            see your account information in here!
          </div>
        </div>
      </div>
      <FrameComponent2
        text="can’t find something? search it here!"
        vuesaxlinearsearchNormal="/vuesaxlinearsearchnormal.svg"
        boolean
        frameDivPadding="9.711627960205078px 16.509767532348633px 9.711627960205078px 14.567441940307617px"
      />
      <ContainerCard
        text="make a new product"
        vuesaxbulkflash="/vuesaxbulkaddsquare.svg"
        boolean
      />
    </div>
  );
};

export default DashboardContainer;
