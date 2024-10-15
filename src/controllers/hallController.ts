import verifyToken from "../jwtToken.ts";
import { addHall, Hall, deleteHallByName, updateHall } from "../queries.ts";

export const addHallCtrl = async (req, res) => {
  //needs a role auht
  const hallData: Hall = req.body;
  try {
    const newHall = await addHall(hallData);
    res.status(201).json({ message: "Hall added successfully", hall: newHall });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
