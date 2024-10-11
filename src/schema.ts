import { pgTable, serial, varchar, int, text, boolean, timestamp, date, time } from 'drizzle-orm/pg-core';
import { foreignKey } from 'drizzle-orm/relations';

// Users Table
export const users = pgTable('users', {
  userId: serial('user_id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  phoneNumber: varchar('phoneNumber', { length: 15 }),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(),
});

// Reservation_holder Table
export const reservationHolder = pgTable('reservation_holder', {
  reserverId: serial('reserver_id').primaryKey(),
  reserverName: varchar('reserver_name', { length: 100 }).notNull(),
  reserverPhoneNumber: varchar('reserver_phoneNumber', { length: 15 }),
  reserverEmail: varchar('reserver_email', { length: 100 }),
  userId: int('user_id')
    .references(() => users.userId, { onDelete: 'cascade' }),
});

// Halls Table
export const halls = pgTable('halls', {
  hallId: serial('hall_id').primaryKey(),
  hallName: varchar('hall_name', { length: 100 }).notNull(),
  hallFacility: text('hall_facility'),
  capacity: int('capacity'),
  type: varchar('type', { length: 10 }),
  primaryInCharge: varchar('primary_in_charge', { length: 100 }),
});

// Reservation Table
export const reservation = pgTable('reservation', {
  reservationId: serial('reservation_id').primaryKey(),
  reserverId: int('reserver_id')
    .references(() => reservationHolder.reserverId, { onDelete: 'cascade' }).notNull(),
  hallId: int('hall_id')
    .references(() => halls.hallId, { onDelete: 'cascade' }).notNull(),
  date: date('date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  purpose: varchar('purpose', { length: 255 }),
  status: varchar('status', { length: 20, default: 'pending' }),
  foodRequirement: boolean('food_requirement', { default: false }),
});

// Notifications Table
export const notifications = pgTable('notifications', {
  notificationId: serial('notification_id').primaryKey(),
  reservationId: int('reservation_id')
    .references(() => reservation.reservationId, { onDelete: 'cascade' }).notNull(),
  notificationType: varchar('notification_type', { length: 50 }),
  recipientEmail: varchar('recipient_email', { length: 100 }),
  timestamp: timestamp('timestamp', { default: 'current_timestamp' }),
});

// Auditlog Table
export const auditLog = pgTable('audit_log', {
  logId: serial('log_id').primaryKey(),
  reservationId: int('reservation_id')
    .references(() => reservation.reservationId, { onDelete: 'cascade' }).notNull(),
  action: varchar('action', { length: 50 }),
  performedBy: int('performed_by')
    .references(() => users.userId, { onDelete: 'cascade' }).notNull(),
  timestamp: timestamp('timestamp', { default: 'current_timestamp' }),
});
