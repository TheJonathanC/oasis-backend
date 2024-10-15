import { Request, Response } from "express";
import { addHall, deleteHallById, Hall, updateHall } from "../queries.ts";

/**
 * Controller to handle the addition of a new hall.
 *
 * @param req - The request object containing the hall data in the body.
 * @param res - The response object used to send back the appropriate HTTP status and message.
 *
 * @remarks
 * This controller function attempts to add a new hall using the provided hall data.
 * It handles different error scenarios and sends back the corresponding HTTP status codes:
 * - 201 Created: When the hall is added successfully.
 * - 400 Bad Request: When required fields are missing in the hall data.
 * - 409 Conflict: When a hall with the same name already exists.
 * - 500 Internal Server Error: For any other errors that occur during the process.
 *
 * @throws Will throw an error if the addition of the hall fails.
 */

export const addHallCtrl = async (req: Request, res: Response) => {
  const hallData: Hall = req.body;
  try {
    const result = await addHall(hallData);
    res.status(201).json({ message: "Hall added successfully", data: result });
  } catch (error: any) {
    if (error.message.includes("The following required fields are missing")) {
      res.status(400).json({ error: error.message });
    } else if (error.message.includes("Hall with this name already exists.")) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * Deletes a hall based on the provided hallId in the request body.
 *
 * @param req - The request object containing the hallId in the body.
 * @param res - The response object used to send back the appropriate HTTP status and message.
 *
 * @returns A JSON response with a success message if the hall is deleted, or an error message if the hallId is missing,
 *          the hall is not found, or an internal server error occurs.
 *
 * @throws Will return a 400 status if the hallId is missing from the request body.
 * @throws Will return a 404 status if no hall is found with the provided hallId.
 * @throws Will return a 500 status for any other internal server errors.
 */

export const deleteHall = async (req: Request, res: Response) => {
  if (!req.body.hallId) {
    return res.status(400).json({ error: "Missing field: hallId" });
  }

  const hallId = parseInt(req.body.hallId, 10);

  try {
    const result = await deleteHallById(hallId);
    res.status(200).json({ message: result.message });
  } catch (error: any) {
    if (error.message.includes("No hall found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * Updates a specific field of a hall entry.
 *
 * @param req - The request object containing hallId, field_name, and changes in the body.
 * @param res - The response object used to send back the updated field or an error message.
 * @returns A promise that resolves to the updated field or an error message.
 *
 * @throws Will throw an error if the update operation fails.
 */
export const updateHallEntry = async (req: Request, res: Response) => {
  try {
    const { hallId, field_name, changes } = req.body;
    const updatedField = await updateHall(hallId, field_name, changes);
    res.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
