import Container3 from "../components/Container3";
import Container1 from "../components/Container1";
import Container2 from "../components/Container2";
import FormContainer from "../components/FormContainer";
import FormContainer1 from "../components/FormContainer1";
import ContainerCardFormFilter1 from "../components/ContainerCardFormFilter1";
import DashboardContainer from "../components/DashboardContainer";
import PremiumAccountContainer from "../components/PremiumAccountContainer";
import ContainerForm from "../components/ContainerForm";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <img className="home-child" alt="" src="/vector-5.svg" />
      <img className="home-item" alt="" src="/vector-3.svg" />
      <img className="home-inner" alt="" src="/vector-4.svg" />
      <main className="ellipse-parent">
        <div className="group-child" />
        <div className="group-item" />
        <div className="group-inner" />
        <div className="ellipse-div" />
        <div className="group-child1" />
        <div className="group-child2" />
        <div className="group-child3" />
        <div className="group-child4" />
      </main>
      <div className="frame-parent">
        <div className="frame-group">
          <div className="frame-container">
            <div className="frame-div">
              <div className="line-parent">
                <div className="frame-child" />
                <div className="frame-item" />
                <div className="frame-inner" />
              </div>
              <div className="line-group">
                <div className="frame-child" />
                <div className="frame-item" />
                <div className="frame-inner" />
              </div>
            </div>
            <div className="frame-parent1">
              <div className="pam-wrapper">
                <b className="pam">PAM</b>
              </div>
              <div className="purchase-account-management-wrapper">
                <div className="pam">( Purchase account management )</div>
              </div>
            </div>
          </div>
          <div className="group-div">
            <div className="frame-parent2">
              <div className="group-parent">
                <div className="vuesaxlinearchart-2-parent">
                  <Container3 chartIcon="/vuesaxlinearchart2.svg" />
                  <Container3
                    chartIcon="/vuesaxlinearchart21.svg"
                    propFilter="blur(27.23px)"
                    propOpacity="0.2"
                  />
                </div>
                <div className="campaigns-wrapper">
                  <div className="pam">Campaigns</div>
                </div>
              </div>
              <div className="group-parent">
                <div className="vuesaxlinearchart-2-parent">
                  <Container1 diagramIcon1="/vuesaxlineardiagram.svg" />
                  <Container1
                    diagramIcon1="/vuesaxlineardiagram1.svg"
                    propFilter="blur(27.23px)"
                    propOpacity="0.2"
                  />
                </div>
                <div className="campaigns-wrapper">
                  <div className="pam">Reports</div>
                </div>
              </div>
              <div className="group-parent">
                <div className="vuesaxlineargraph-parent">
                  <Container2 graphIconName="/vuesaxlineargraph.svg" />
                  <Container2
                    graphIconName="/vuesaxlineargraph1.svg"
                    propFilter="blur(27.23px)"
                    propOpacity="0.2"
                  />
                </div>
                <div className="campaigns-wrapper">
                  <div className="pam">Analitics</div>
                </div>
              </div>
              <div className="vuesaxlinearsms-parent">
                <FormContainer />
                <div className="campaigns-wrapper">
                  <div className="pam">Inbox</div>
                </div>
              </div>
              <div className="vuesaxlinearsms-parent">
                <FormContainer1 />
                <div className="campaigns-wrapper">
                  <div className="pam">Setting</div>
                </div>
              </div>
            </div>
            <div className="frame-parent3">
              <div className="group-parent2">
                <div className="vuesaxboldelement-4-parent">
                  <ContainerCardFormFilter1 elementText="/vuesaxboldelement4.svg" />
                  <ContainerCardFormFilter1
                    elementText="/vuesaxboldelement41.svg"
                    propFilter="blur(27.23px)"
                    propOpacity="0.2"
                  />
                </div>
                <div className="campaigns-wrapper">
                  <div className="pam">Dashboard</div>
                </div>
              </div>
              <div className="rectangle-div" />
            </div>
          </div>
        </div>
        <div className="frame-parent4">
          <div className="frame-div">
            <div className="image-2-parent">
              <img className="image-2-icon" alt="" src="/image-2@2x.png" />
              <img className="image-2-icon1" alt="" src="/image-21@2x.png" />
            </div>
          </div>
          <div className="username">Erfan Rezaii</div>
          <img
            className="vuesaxbulkarrow-down-icon"
            alt=""
            src="/vuesaxbulkarrowdown.svg"
          />
        </div>
      </div>
      <main className="frame-main">
        <DashboardContainer />
        <section className="frame-section">
          <PremiumAccountContainer />
          <div className="frame-div">
            <img className="group-icon" alt="" src="/group-11.svg" />
          </div>
        </section>
        <ContainerForm />
      </main>
    </div>
  );
};

export default Home;
