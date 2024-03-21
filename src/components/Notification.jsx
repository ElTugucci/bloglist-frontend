import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);

  const notificationStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 20,
    background: "lightgray",
    borderSize: 20,
    borderRadius: 3,
    borderStyle: "solid",
    marginBottom: 10,
    padding: 10,
  };

  if (notification === '') {
    return null;
  }

  return <div style={notificationStyle}>{notification}</div>;
};
export default Notification;
