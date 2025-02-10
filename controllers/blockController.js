import Block from "../models/block.js";

// Get all blocks
export const getAllBlocks = async (req, res) => {
  try {
    const blocks = await Block.findAll();
    res.status(200).json(blocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new block
export const createBlock = async (req, res) => {
  const { name, latitude, longitude } = req.body;
  try {
    const newBlock = await Block.create({ name, latitude, longitude });
    res.status(201).json(newBlock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a block
export const updateBlock = async (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude } = req.body;
  try {
    const block = await Block.findByPk(id);
    if (!block) return res.status(404).json({ message: "Block not found" });

    block.name = name || block.name;
    block.latitude = latitude || block.latitude;
    block.longitude = longitude || block.longitude;

    await block.save();
    res.status(200).json(block);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a block
export const deleteBlock = async (req, res) => {
  const { id } = req.params;
  try {
    const block = await Block.findByPk(id);
    if (!block) return res.status(404).json({ message: "Block not found" });

    await block.destroy();
    res.status(200).json({ message: "Block deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
