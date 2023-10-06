import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import FrameComponent from "./FrameComponent";
import CircleContainer from "./CircleContainer";
import "./ContainerForm.css";

const ContainerForm = () => {
  return (
    <div className="frame-parent8">
      <div className="group-parent3">
        <div className="frame-parent9">
          <div className="vuesaxlinearprofile-2user-wrapper">
            <img
              className="vuesaxlinearprofile-2user-icon1"
              alt=""
              src="/vuesaxlinearprofile2user.svg"
            />
          </div>
          <div className="all-followers-1000-wrapper">
            <div className="all-followers-1000-container">
              <p className="all-followers">all followers</p>
              <p className="p">1000</p>
            </div>
          </div>
          <div className="frame-parent10">
            <div className="group-parent4">
              <img className="frame-child3" alt="" src="/group-9.svg" />
              <div className="div">1.2 %</div>
            </div>
            <div className="this-month-wrapper">
              <div className="this-month">this month</div>
            </div>
          </div>
        </div>
        <FrameComponent
          frameComponentFrame2="see info"
          frameDivBorderRadius="unset"
          frameDivBackgroundColor="unset"
          frameDivDisplay="unset"
          frameDivFlexDirection="unset"
          frameDivPadding="unset"
          frameDivBoxSizing="unset"
          frameDivAlignItems="unset"
          frameDivJustifyContent="unset"
          frameDivPosition="absolute"
          frameDivTop="97.65px"
          frameDivLeft="152.03px"
        />
      </div>
      <div className="group-parent3">
        <div className="total-earning-125k-wrapper">
          <div className="all-followers-1000-container">
            <p className="all-followers">total earning</p>
            <p className="p">125K</p>
          </div>
        </div>
        <div className="frame-parent12">
          <div className="group-parent4">
            <img className="frame-child3" alt="" src="/group-91.svg" />
            <div className="div">2.12 %</div>
          </div>
          <div className="this-month-wrapper">
            <div className="this-month">this month</div>
          </div>
        </div>
        <div className="vuesaxlineardollar-circle-wrapper">
          <CircleContainer />
        </div>
        <FrameComponent
          frameComponentFrame2="see info"
          frameDivBorderRadius="unset"
          frameDivBackgroundColor="unset"
          frameDivDisplay="unset"
          frameDivFlexDirection="unset"
          frameDivPadding="unset"
          frameDivBoxSizing="unset"
          frameDivAlignItems="unset"
          frameDivJustifyContent="unset"
          frameDivPosition="absolute"
          frameDivTop="97.65px"
          frameDivLeft="152.03px"
        />
      </div>
      <div className="group-parent3">
        <div className="frame-parent13">
          <div className="vuesaxlinearprofile-2user-wrapper">
            <img
              className="vuesaxlinearprofile-2user-icon1"
              alt=""
              src="/vuesaxlinearprofile2user1.svg"
            />
          </div>
          <div className="all-followers-1000-wrapper">
            <div className="all-followers-1000-container">
              <p className="all-followers">all users</p>
              <p className="p">64K</p>
            </div>
          </div>
          <div className="frame-parent10">
            <div className="group-parent4">
              <img className="frame-child3" alt="" src="/group-92.svg" />
              <div className="div">12.5 %</div>
            </div>
            <div className="this-month-wrapper">
              <div className="this-month">this month</div>
            </div>
          </div>
        </div>
        <FrameComponent
          frameComponentFrame2="see info"
          frameDivBorderRadius="unset"
          frameDivBackgroundColor="unset"
          frameDivDisplay="unset"
          frameDivFlexDirection="unset"
          frameDivPadding="unset"
          frameDivBoxSizing="unset"
          frameDivAlignItems="unset"
          frameDivJustifyContent="unset"
          frameDivPosition="absolute"
          frameDivTop="97.65px"
          frameDivLeft="152.03px"
        />
      </div>
    </div>
  );
};

export default ContainerForm;
