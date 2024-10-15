import { Console } from "console";
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
    // Check if all required fields are present
    const missingFields: string[] = [];

    if (!hallData.hallName) missingFields.push("hallName");
    if (!hallData.hallFacility) missingFields.push("hallFacility");
    if (hallData.capacity === undefined) missingFields.push("capacity");
    if (!hallData.type) missingFields.push("type");
    if (!hallData.primaryInCharge) missingFields.push("primaryInCharge");

    // If there are missing fields, throw a professional error message
    if (missingFields.length > 0) {
      throw new Error(
        `The following required fields are missing: ${missingFields.join(
          ", "
        )}.Please provide all required information and try again.`
      );
    }

    // Proceed with the database insert
    const result = await db.insert(halls).values(hallData).execute();

    return result; // Successfully added the hall
  } catch (error: any) {
    if (error.code === "23505") {
      // Unique violation error code in PostgreSQL
      throw new Error(
        "A hall with this name already exists. Please choose a different name."
      );
    } else {
      throw new Error(`Error adding hall: ${error.message}`);
    }
  }
};

export const deleteHallById = async (hallId: number) => {
  try {
    const result = await db
      .delete(halls)
      .where(eq(halls.hallId, hallId)) // Using eq for exact matching of hallId
      .execute();

    // Check if a hall was deleted
    if (result.count === 0) {
      throw new Error(`No hall found with the id ${hallId}`);
    }
    console.log(`Hall ${hallId} has been successfully deleted.`);
    return { message: `Hall ${hallId} has been deleted.` };
  } catch (error: any) {
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
