import verifyToken from "../jwtToken.ts";
import { addHall, Hall, deleteHallByName, updateHall } from "../queries.ts";

export const addHallCtrl = async (req, res) => {
  try {
    const hallData = req.body;
    const result = await addHall(hallData);
    res.status(201).json(result); // 201 Created
  } catch (error: any) {
    if (error.message === "Hall with this name already exists.") {
      res.status(409).json({ error: error.message }); // 409 Conflict
    } else {
      res.status(500).json({ error: error.message }); // 500 Internal Server Error
    }
  }
};

export const deleteHall = async (req, res) => {
  try {
    const { hallId } = req.body;
    const deletedHall = await deleteHallByName(hallId);
    res.status(200).json(deletedHall);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
