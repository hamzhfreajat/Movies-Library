
DROP TABLE IF EXISTS movies_data;

CREATE TABLE IF NOT EXISTS movies_data (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    movies_path VARCHAR(255), 
    overview VARCHAR(255),
    comment VARCHAR(255)
);