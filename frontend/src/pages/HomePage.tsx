import React from "react";

const HomePage = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Available Parking Spots</h1>
      {/* Filter */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input type="date" className="form-control" />
        </div>
        <div className="col-md-6 mb-2">
          <input type="time" className="form-control" />
        </div>
      </div>

      {/* List parking spot */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">B-150</h5>
              <p className="card-text">Available from 10:00 to 18:00</p>
              <p className="card-text">Price: 50 kr</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">B-151</h5>
              <p className="card-text">Available from 08:00 to 16:00</p>
              <p className="card-text">Price: 40 kr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
