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

export const deleteHallByName = async (hallName) => {
  try {
    const result = await db
      .delete(halls)
      .where(eq(halls.hallName, hallName)) // Use eq for comparison
      .execute();

    // Check if a hall was deleted
    if (result.count === 0) {
      throw new Error(`No hall found with the name "${hallName}"`);
    }

    console.log(`Hall "${hallName}" has been successfully deleted.`);
    return { message: `Hall "${hallName}" has been deleted.` };
  } catch (error) {
    console.error("Error deleting hall:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};
