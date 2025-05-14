import React from "react";

const HomePage = () => {
  return (
    <div className="p-4">
      <h1>Available Parking Spots</h1>
      {/* Filter */}
      <div>
        <input type="date" />
        <input type="time" />
      </div>

      {/* List parking spot */}
      <div>
        <div>
          <h2>B-150</h2>
          <p>Available from 10:00 to 18:00</p>
          <p>Price: 50kr</p>
        </div>
        <div>
          <h2>B-151</h2>
          <p>Available from 08:00 to 16:00</p>
          <p>Price: 40kr</p>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
