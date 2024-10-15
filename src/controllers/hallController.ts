import verifyToken from "../jwtToken.ts";
import { addHall, Hall, deleteHallByName } from "../queries.ts";

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
    const { hallName } = req.body;
    const deletedHall = await deleteHallByName(hallName);
    res.status(200).json(deletedHall);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
