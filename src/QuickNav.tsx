import ScrollableComponent from "./Scrollable";

const QuickNav: React.FC = () => {
  const getItems = (): JSX.Element[] => {
    return [
      {
        id: 1,
        label: "Weather",
      },
      {
        id: 2,
        label: "Food",
      },
      {
        id: 3,
        label: "Apps",
      },
      {
        id: 4,
        label: "Movies",
      },
    ].map((item: any) => {
      return (
        <div key={item.id} className="quick-nav-item clear-button">
          <span className="quick-nav-item-label">{item.label}</span>
        </div>
      );
    });
  };

  return <ScrollableComponent id="quick-nav">{getItems()}</ScrollableComponent>;
};

export default QuickNav;