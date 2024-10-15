import { eq, SQLWrapper } from "drizzle-orm";
import db from "./db.ts";
import { halls, reservation } from "./schema.ts";

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

/**
 * Adds a new hall to the database.
 *
 * @param hallData - An object containing the hall details.
 * @param hallData.hallName - The name of the hall.
 * @param hallData.hallFacility - The facility of the hall.
 * @param hallData.capacity - The capacity of the hall.
 * @param hallData.type - The type of the hall.
 * @param hallData.primaryInCharge - The primary person in charge of the hall.
 *
 * @returns The result of the database insert operation.
 *
 * @throws Will throw an error if any required fields are missing.
 * @throws Will throw an error if a hall with the same name already exists.
 * @throws Will throw an error if there is an issue with the database operation.
 *
 * @example
 * ```typescript
 * const newHall = {
 *   hallName: "Conference Room A",
 *   hallFacility: "Projector, Wi-Fi",
 *   capacity: 50,
 *   type: "Conference",
 *   primaryInCharge: "John Doe"
 * };
 *
 * addHall(newHall)
 *   .then(result => {
 *     console.log("Hall added successfully:", result);
 *   })
 *   .catch(error => {
 *     console.error("Error adding hall:", error.message);
 *   });
 * ```
 */

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

/**
 * Deletes a hall by its ID.
 *
 * @param hallId - The ID of the hall to be deleted.
 * @returns An object containing a message confirming the deletion.
 * @throws Will throw an error if no hall is found with the given ID or if there is an issue with the deletion process.
 *
 * @example
 * ```typescript
 * try {
 *   const response = await deleteHallById(123);
 *   console.log(response.message); // "Hall 123 has been deleted."
 * } catch (error) {
 *   console.error("Failed to delete hall:", error);
 * }
 * ```
 */

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

// const fieldMapping = {
//   hallId: "id",
//   hallName: "name",
//   hallFacility: "facility",
//   capacity: "limit",
//   primaryInCharge: "inchargeName",
// };

/**
 * Updates a specific column of a hall entry in the database.
 *
 * @param hallId - The ID of the hall to update. Can be a number or SQLWrapper.
 * @param columnName - The name of the column to update. Must be one of "hallName", "hallFacility", "capacity", "type", or "primaryInCharge".
 * @param newValue - The new value to set for the specified column.
 * @returns A promise that resolves to an object containing a success message if the update is successful.
 * @throws Will throw an error if the column name is invalid or if no hall is found with the specified ID.
 *
 * @example
 * ```typescript
 * try {
 *   const result = await updateHall(1, "hallName", "New Hall Name");
 *   console.log(result.message); // Hall with ID "1" has been updated.
 * } catch (error) {
 *   console.error(error.message); // Handle the error appropriately
 * }
 * ```
 */

export const updateHall = async (
  hallId: number | SQLWrapper,
  columnName: string,
  newValue: any
) => {
  try {
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
