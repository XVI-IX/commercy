-- create user table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  avatar VARCHAR(255),
  billing_address VARCHAR(255),
  shipping_address VARCHAR(255),
  phone_number VARCHAR(15),
  date_of_birth DATE,
  order_history JSONB[],
  wishlist JSONB[],
  cart_items JSONB[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP,
  modified_at TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  user_role VARCHAR(20),
  email VARCHAR(50) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL UNIQUE,
  verificationToken VARCHAR(255)
);

CREATE INDEX idx_verificationtoken ON users (verificationtoken);
CREATE INDEX idx_email ON users (email);


CREATE TABLE IF NOT EXISTS products ( 
  product_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  product_name VARCHAR(255),
  product_img VARCHAR(255),
  product_description TEXT,
  price FLOAT NOT NULL DEFAULT 0,
  category VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL 0,
);

CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(product_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(user_id),
  quantity INTEGER
);