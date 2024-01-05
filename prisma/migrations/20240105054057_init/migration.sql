-- CreateTable
CREATE TABLE "orders" (
    "order_id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,
    "quantity" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "product_name" VARCHAR(255),
    "prouct_description" TEXT,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "category" VARCHAR(50) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "avatar" VARCHAR(255),
    "billing_address" VARCHAR(255),
    "shipping_address" VARCHAR(255),
    "phone_number" VARCHAR(15),
    "date_of_birth" DATE,
    "order_history" JSONB[],
    "wishlist" JSONB[],
    "cart_items" JSONB[],
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMP(6),
    "modified_at" TIMESTAMP(6),
    "verified" BOOLEAN,
    "user_role" VARCHAR(20),
    "email" VARCHAR(50) NOT NULL,
    "passwordhash" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_passwordhash_key" ON "users"("passwordhash");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
