import verifyToken from "../jwtToken.ts";
import { Request, Response } from "express";
import { addHall, Hall, deleteHallById, updateHall } from "../queries.ts";

export const addHallCtrl = async (req: Request, res: Response) => {
  const hallData: Hall = req.body;

  try {
    const result = await addHall(hallData);
    // If successful, send a 201 Created status
    res.status(201).json({ message: "Hall added successfully", data: result });
  } catch (error: any) {
    // Handle specific "Missing required fields" error for 400 status
    if (error.message.includes("The following required fields are missing")) {
      res.status(400).json({ error: error.message }); // 400 Bad Request
    } else if (error.message.includes("Hall with this name already exists.")) {
      res.status(409).json({ error: error.message }); // 409 Conflict
    } else {
      // For any other errors, send a 500 Internal Server Error
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const deleteHall = async (req: Request, res: Response) => {
  if (!req.body.hallId) {
    return res.status(400).json({ error: "Missing field: hallId" });
  }
  const hallId = parseInt(req.body.hallId, 10); // Extract hallId from URL and convert to number

  try {
    // Call the deleteHallById function
    const result = await deleteHallById(hallId);

    // If successful, send a 200 OK status
    res.status(200).json({ message: result.message });
  } catch (error: any) {
    // Handle specific "No hall found" error for 404 status
    if (error.message.includes("No hall found")) {
      res.status(404).json({ error: error.message });
    } else {
      // For any other errors, send a 500 Internal Server Error
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const updateHallEntry = async (req, res) => {
  try {
    const { hallId, field_name, changes } = req.body;
    const updatedField = await updateHall(hallId, field_name, changes);
    req.status(200).json(updatedField);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
