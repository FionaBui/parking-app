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
  location TEXT UNIQUE NOT NULL, -- A-1, B-25,...
  owner_id INTEGER,              -- NULL if no one rents
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  price INTEGER DEFAULT 0,
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

-- users
INSERT INTO users (name, email, apartment_info)
VALUES 
  ('Fiona', 'fiona@example.com', 'lgh 1303'),
  ('Alice', 'alice@example.com', 'lgh 1002');
  ('Bob', 'bob@example.com', 'lgh 1402')

-- rentals
INSERT INTO rentals (spot_id, renter_id, rent_time)
VALUES 
  (1, 3, '2025-05-21 10:00:00');  -- Bob thuê A-1


-- 🅿️ Create 50 fixed parking spaces (A-1 → A-25, B-1 → B-25)
INSERT INTO parking_spots (location) VALUES
('A-1'), ('A-2'), ('A-3'), ('A-4'), ('A-5'),
('A-6'), ('A-7'), ('A-8'), ('A-9'), ('A-10'),
('A-11'), ('A-12'), ('A-13'), ('A-14'), ('A-15'),
('A-16'), ('A-17'), ('A-18'), ('A-19'), ('A-20'),
('A-21'), ('A-22'), ('A-23'), ('A-24'), ('A-25'),

('B-1'), ('B-2'), ('B-3'), ('B-4'), ('B-5'),
('B-6'), ('B-7'), ('B-8'), ('B-9'), ('B-10'),
('B-11'), ('B-12'), ('B-13'), ('B-14'), ('B-15'),
('B-16'), ('B-17'), ('B-18'), ('B-19'), ('B-20'),
('B-21'), ('B-22'), ('B-23'), ('B-24'), ('B-25');

UPDATE parking_spots SET owner_id = 1, start_time = '2025-05-21 08:00', end_time = '2025-05-21 18:00', price = 25 WHERE location = 'A-1';
UPDATE parking_spots SET owner_id = 2, start_time = '2025-05-21 09:00', end_time = '2025-05-21 17:00', price = 20 WHERE location = 'B-3';