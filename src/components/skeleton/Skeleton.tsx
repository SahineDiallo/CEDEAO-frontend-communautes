import "./Skeleton.css"; // Create a CSS file for the skeleton styles

const Skeleton = () => {
  return (
    <div className="skeleton-container mt-3">
      {/* Render five skeleton blocks */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="skeleton-block"></div>
      ))}
    </div>
  );
};

export default Skeleton;
