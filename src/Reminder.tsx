const Reminder: React.FC = () => {
  return (
    <div className="reminder">
      <div className="reminder-icon">
        <i className="fa-regular fa-bell" />
      </div>
      <span className="reminder-text">
        Extra cool people meeting <span className="reminder-time">10AM</span>
      </span>
    </div>
  );
};

export default Reminder;
