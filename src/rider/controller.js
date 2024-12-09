const Rider  = require('../model').rider; // Adjust the path to your model

// Create a new rider
const createRider = async (req, res) => {
  try {
    const rider = await Rider.create(req.body);
    res.status(201).json({ message: 'Rider created successfully', data: rider });
  } catch (error) {
    console.error('Error creating rider:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all riders
const getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.findAll();
    res.status(200).json({ data: riders });
  } catch (error) {
    console.error('Error fetching riders:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a rider by ID
const getRiderById = async (req, res) => {
  try {
    const { id } = req.params;
    const rider = await Rider.findByPk(id);

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    res.status(200).json({ data: rider });
  } catch (error) {
    console.error('Error fetching rider:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a rider
const updateRider = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Rider.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Rider not found or no changes made' });
    }

    const updatedRider = await Rider.findByPk(id);
    res.status(200).json({ message: 'Rider updated successfully', data: updatedRider });
  } catch (error) {
    console.error('Error updating rider:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a rider
const deleteRider = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Rider.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    res.status(200).json({ message: 'Rider deleted successfully' });
  } catch (error) {
    console.error('Error deleting rider:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRider,
  getAllRiders,
  getRiderById,
  updateRider,
  deleteRider,
};
