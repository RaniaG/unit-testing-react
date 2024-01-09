import "./style.css";
export const Loading = () => {
  return (
    <div className="loading-background">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
