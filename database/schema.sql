DROP TABLE IF EXISTS rentals;
DROP TABLE IF EXISTS parking_spots;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  apartment_info TEXT
);

CREATE TABLE parking_spots (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL,
  location TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  price INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE rentals (
  id SERIAL PRIMARY KEY,
  spot_id INTEGER NOT NULL,
  renter_id INTEGER NOT NULL,
  rent_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (spot_id) REFERENCES parking_spots(id),
  FOREIGN KEY (renter_id) REFERENCES users(id)
);

INSERT INTO users (name, email, apartment_info)
VALUES 
  ('Fiona', 'fiona@example.com', 'lgh 1303'),
  ('Alice', 'alice@example.com', 'lgh 1002');

INSERT INTO parking_spots (owner_id, location, start_time, end_time, price)
VALUES 
  (1, 'B-12', '2025-05-13 08:00', '2025-05-13 17:00', 20),
  (2, 'A-02', '2025-05-13 09:30', '2025-05-13 18:00', 25);
