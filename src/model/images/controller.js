const  Image  = require('..').image; // Adjust the path to your models

// Create a new image
const createImage = async (req, res) => {
  try {
    const { name, path } = req.body;

    // Check if image with the same name or path already exists
    const existingImage = await Image.findOne({ where: { name } });
    if (existingImage) {
      return res.status(400).json({ message: 'Image with the same name already exists' });
    }

    const image = await Image.create({ name, path });
    res.status(201).json({ message: 'Image created successfully', data: image });
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all images
const getAllImages = async (req, res) => {
  try {
    const images = await Image.findAll();
    res.status(200).json({ data: images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get an image by ID
const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findByPk(id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).json({ data: image });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an image
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, path } = req.body;

    const [updated] = await Image.update({ name, path }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Image not found or no changes made' });
    }

    const updatedImage = await Image.findByPk(id);
    res.status(200).json({ message: 'Image updated successfully', data: updatedImage });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete an image
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Image.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
};
