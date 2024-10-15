import db from "./db.ts";
import {
  users,
  reservationHolder,
  halls,
  reservation,
  notifications,
} from "./schema.ts";
import { eq } from "drizzle-orm";
export async function getAllReservations() {
  const res = await db.select().from(reservation);
  return res;
}

export interface Hall {
  hallName: string;
  hallFacility: string;
  capacity: number;
  type: string;
  primaryInCharge: string;
}

export const addHall = async (hallData: Hall) => {
  try {
    const result = await db.insert(halls).values(hallData);
    return result;
  } catch (error) {
    throw new Error(`Error adding hall: ${error.message}`);
  }
};

export const deleteHallByName = async (hallId) => {
  try {
    const result = await db
      .delete(halls)
      .where(eq(halls.hallId, hallId)) // Use eq for comparison
      .execute();

    // Check if a hall was deleted
    if (result.count === 0) {
      throw new Error(`No hall found with the id "${hallId}"`);
    }

    console.log(`Hall "${hallId}" has been successfully deleted.`);
    return { message: `Hall "${hallId}" has been deleted.` };
  } catch (error) {
    console.error("Error deleting hall:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

const fieldMapping = {
  hallId: "id",
  hallName: "name",
  hallFacility: "facility",
  capacity: "limit",
  primaryInCharge: "inchargeName",
};

export const updateHall = async (hallId, columnName, newValue) => {
  try {
    console.log("Entered the updateHall function");
    // Ensure the columnName is valid
    const validColumns = [
      "hallName",
      "hallFacility",
      "capacity",
      "type",
      "primaryInCharge",
    ];

    if (!validColumns.includes(columnName)) {
      throw new Error(
        `Invalid column name: ${columnName}. Valid columns are: ${validColumns.join(
          ", "
        )}`
      );
    }

    // Build the update query
    const result = await db
      .update(halls)
      .set({ [columnName]: newValue }) // Dynamically set the column to be updated
      .where(eq(halls.hallId, hallId)) // Ensure the hall ID is specified
      .execute();

    // Check if a hall was updated
    if (result.count === 0) {
      throw new Error(`No hall found with ID "${hallId}" to update.`);
    }

    console.log(`Hall with ID "${hallId}" has been successfully updated.`);
    return { message: `Hall with ID "${hallId}" has been updated.` };
  } catch (error) {
    console.error("Error updating hall entry:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
