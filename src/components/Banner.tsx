import React from "react";

const Banner: React.FC = () => {
  return (
    <div className="bg-teal-800 relative h-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-30" style={{ backgroundImage: `url('/path/to/your/background-image.png')` }}></div>
      <h1 className="text-white text-3xl font-bold z-10">Communautés</h1>
    </div>
  );
};

export default Banner;
