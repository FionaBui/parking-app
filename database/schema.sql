DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS parking_spots CASCADE;
DROP TABLE IF EXISTS available_spot CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  apartment_info TEXT
);

CREATE TABLE parking_spots (
  id SERIAL PRIMARY KEY,
  location TEXT UNIQUE NOT NULL,   -- A-1, B-25, ...
  owner_id INTEGER ,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE available_spot(
  id SERIAL PRIMARY KEY,
  spot_id INTEGER NOT NULL,              
  date DATE NOT NULL,  
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price INTEGER DEFAULT 0,
  FOREIGN KEY (spot_id) REFERENCES parking_spots(id),
  UNIQUE (spot_id, date)
);

CREATE TABLE rentals (
  id SERIAL PRIMARY KEY,
  spot_id INTEGER NOT NULL,
  renter_id INTEGER NOT NULL,
  rent_date DATE NOT NULL,
  rent_start_time TIME NOT NULL,
  rent_end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (spot_id) REFERENCES parking_spots(id),
  FOREIGN KEY (renter_id) REFERENCES users(id)
);

-- users
INSERT INTO users (name, email, apartment_info)
VALUES 
  ('Clare', 'clare@example.com', '1303'),
  ('Alice', 'alice@example.com', '1002'),
  ('Bob', 'bob@example.com', '1402'),
  ('Anna', 'anna@example.com', '1104'),
  ('John', 'john@example.com', '1201'),
  ('Jane', 'jane@example.com', '1302'),
  ('Carlos', 'carlos@example.com', '1203'),
  ('Emily', 'emily@example.com', '1301'),
  ('Liam', 'liam@example.com', '1202'),
  ('Sophia', 'sophia@example.com', '1102'),
  ('Oliver', 'oliver@example.com', '1103'),
  ('Maja', 'maja@example.com', '1401'),
  ('Lucas', 'lucas@example.com', '1403'),
  ('Elin', 'elin@example.com', '1001');


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


UPDATE parking_spots
SET owner_id = CASE 
  WHEN location = 'A-1' THEN 1
  WHEN location = 'A-2' THEN 2
  WHEN location = 'A-3' THEN 3
  WHEN location = 'A-4' THEN 4
  WHEN location = 'A-5' THEN 5
  WHEN location = 'A-6' THEN 6
  WHEN location = 'A-7' THEN 7
  WHEN location = 'B-1' THEN 8
  WHEN location = 'B-2' THEN 9
  WHEN location = 'B-3' THEN 10
  WHEN location = 'B-4' THEN 11
  WHEN location = 'B-5' THEN 12
  WHEN location = 'B-6' THEN 13
  WHEN location = 'B-7' THEN 14
  ELSE owner_id
END
WHERE location IN ('A-1', 'A-2', 'A-3', 'A-4', 'A-5', 'A-6', 'A-7', 'B-1', 'B-2', 'B-3', 'B-4', 'B-5', 'B-6', 'B-7');

-- available_spot
INSERT INTO available_spot (spot_id, date, start_time, end_time, price) VALUES 
(1,'2025-06-03', '07:00', '17:00', 1), 
(1,'2025-06-04', '08:00','16:00', 5), 
(1,'2025-06-05', '08:00','16:00', 5),
(2,'2025-06-03', '07:00', '17:00', 1), 
(2,'2025-06-04', '08:00','16:00', 5), 
(2,'2025-06-05', '08:00','16:00', 5),
(5,'2025-06-03', '07:00', '17:00', 1), 
(5,'2025-06-04', '08:00','16:00', 3), 
(5,'2025-06-05', '09:00','18:00', 5),
(7,'2025-06-03', '07:00', '17:00', 1), 
(7,'2025-06-04', '08:00','16:00', 3), 
(7,'2025-06-05', '09:00','19:00', 2),
(26,'2025-06-03', '06:00', '17:00', 5), 
(26,'2025-06-04', '09:00','18:00', 3), 
(26,'2025-06-05', '07:00','16:00', 5),
(29,'2025-06-03', '08:00', '16:00', 5), 
(29,'2025-06-04', '06:00','19:00', 3), 
(29,'2025-06-05', '09:00','20:00', 5);

-- rentals
INSERT INTO rentals (spot_id, renter_id, rent_date, rent_start_time, rent_end_time)
VALUES 
(1, 3, '2025-06-03', '08:00', '12:00'),
(1, 6, '2025-06-04', '08:00', '12:00'),
(7, 5, '2025-06-03', '08:00', '15:00');


