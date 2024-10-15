CREATE TABLE IF NOT EXISTS "audit_log" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"reservation_id" integer NOT NULL,
	"action" varchar(50),
	"performed_by" integer NOT NULL,
	"timestamp" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "halls" (
	"hall_id" serial PRIMARY KEY NOT NULL,
	"hall_name" varchar(100) NOT NULL,
	"hall_facility" text NOT NULL,
	"capacity" integer NOT NULL,
	"type" varchar(10) NOT NULL,
	"primary_in_charge" varchar(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "notifications" (
	"notification_id" serial PRIMARY KEY NOT NULL,
	"reservation_id" integer NOT NULL,
	"notification_type" varchar(50),
	"recipient_email" varchar(100),
	"timestamp" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "reservation" (
	"reservation_id" serial PRIMARY KEY NOT NULL,
	"reserver_id" integer NOT NULL,
	"hall_id" integer NOT NULL,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"purpose" varchar(255),
	"status" varchar(20) DEFAULT 'pending',
	"food_requirement" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "reservation_holder" (
	"reserver_id" serial PRIMARY KEY NOT NULL,
	"reserver_name" varchar(100) NOT NULL,
	"reserver_phoneNumber" varchar(15),
	"reserver_email" varchar(100),
	"user_id" integer
);

CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phoneNumber" varchar(15),
	"password" varchar(255) NOT NULL,
	"role" varchar(20) NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_reservation_id_reservation_reservation_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("reservation_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_performed_by_users_user_id_fk" FOREIGN KEY ("performed_by") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_reservation_id_reservation_reservation_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("reservation_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "reservation" ADD CONSTRAINT "reservation_reserver_id_reservation_holder_reserver_id_fk" FOREIGN KEY ("reserver_id") REFERENCES "reservation_holder"("reserver_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "reservation" ADD CONSTRAINT "reservation_hall_id_halls_hall_id_fk" FOREIGN KEY ("hall_id") REFERENCES "halls"("hall_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "reservation_holder" ADD CONSTRAINT "reservation_holder_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
