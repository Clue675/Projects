import "./ContainerCard.css";

const ContainerCard = ({
  text = "View features",
  vuesaxbulkflash,
  boolean = true,
}) => {
  return (
    <div className="account-purchase-group">
      <div className="account-purchase1">{text}</div>
      {boolean && (
        <img className="vuesaxbulkflash-icon1" alt="" src={vuesaxbulkflash} />
      )}
    </div>
  );
};

export default ContainerCard;
