CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    apartment_info TEXT
);

CREATE TABLE parking_spots (
    id INTEGER PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    price INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE rentals(
    id INTEGER PRIMARY KEY,
    spot_id INTEGER NOT NULL,
    rental_id INTEGER NOT NULL,
    rent_time TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES parking_spots(id),
    FOREIGN KEY (rental_id) REFERENCES users(id)
);