import {
  serial,
  varchar,
  integer,
  text,
  boolean,
  timestamp,
  date,
  time,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";

import { pgTable } from "drizzle-orm/pg-core/table";
import { ForeignKey } from "drizzle-orm/pg-core";

// Users Table
export const RoleEnum = pgEnum("role_enum", ["admin", "moderator", "viewer"]);

// Define the users table
export const users = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 15 }),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // Use varchar and ensure it corresponds to the enum
});

// Reservation_holder Table
export const reservationHolder = pgTable("reservation_holder", {
  reserverId: serial("reserver_id").primaryKey(),
  reserverName: varchar("reserver_name", { length: 100 }).notNull(),
  reserverPhoneNumber: varchar("reserver_phoneNumber", { length: 15 }),
  reserverEmail: varchar("reserver_email", { length: 100 }),
  userId: integer("user_id").references(() => users.userId, {
    onDelete: "cascade",
  }),
});

// Halls Table
export const halls = pgTable(
  "halls",
  {
    hallId: serial("hall_id").primaryKey(), // Primary key
    hallName: varchar("hall_name", { length: 100 }).notNull(), // Required and unique
    hallFacility: text("hall_facility").notNull(), // Required
    capacity: integer("capacity").notNull(), // Required
    type: varchar("type", { length: 10 }).notNull(), // Required
    primaryInCharge: varchar("primary_in_charge", { length: 100 }).notNull(), // Required
  },
  (table) => ({
    uniqueHallName: uniqueIndex("unique_hall_name").on(table.hallName),
  })
);

// Reservation Table
export const reservation = pgTable("reservation", {
  reservationId: serial("reservation_id").primaryKey(),
  reserverId: integer("reserver_id")
    .references(() => reservationHolder.reserverId, { onDelete: "cascade" })
    .notNull(),
  hallId: integer("hall_id")
    .references(() => halls.hallId, { onDelete: "cascade" })
    .notNull(),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  purpose: varchar("purpose", { length: 255 }),

  // Correct way to set default value
  status: varchar("status", { length: 20 }).default("pending"),

  foodRequirement: boolean("food_requirement").default(false),
});

// Notifications Table
export const notifications = pgTable("notifications", {
  notificationId: serial("notification_id").primaryKey(),
  reservationId: integer("reservation_id")
    .references(() => reservation.reservationId, { onDelete: "cascade" })
    .notNull(),
  notificationType: varchar("notification_type", { length: 50 }),
  recipientEmail: varchar("recipient_email", { length: 100 }),

  timestamp: timestamp("timestamp").defaultNow(),
});

// Auditlog Table
export const auditLog = pgTable("audit_log", {
  logId: serial("log_id").primaryKey(),
  reservationId: integer("reservation_id")
    .references(() => reservation.reservationId, { onDelete: "cascade" })
    .notNull(),
  action: varchar("action", { length: 50 }),
  performedBy: integer("performed_by")
    .references(() => users.userId, { onDelete: "cascade" })
    .notNull(),

  // Correct way to set the default timestamp
  timestamp: timestamp("timestamp").defaultNow(),
});
