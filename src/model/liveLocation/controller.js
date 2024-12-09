const  LiveLocation  = require('..').liveLocation; // Adjust the path to your models

// Create a new LiveLocation
const createLiveLocation = async (req, res) => {
  try {
    const { latitude, longitude, status } = req.body;

    const liveLocation = await LiveLocation.create({ latitude, longitude, status });

    res.status(201).json({
      message: 'Live location created successfully',
      data: liveLocation,
    });
  } catch (error) {
    console.error('Error creating live location:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all LiveLocations
const getAllLiveLocations = async (req, res) => {
  try {
    const liveLocations = await LiveLocation.findAll();
    res.status(200).json({ data: liveLocations });
  } catch (error) {
    console.error('Error fetching live locations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a LiveLocation by ID
const getLiveLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const liveLocation = await LiveLocation.findByPk(id);

    if (!liveLocation) {
      return res.status(404).json({ message: 'Live location not found' });
    }

    res.status(200).json({ data: liveLocation });
  } catch (error) {
    console.error('Error fetching live location:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a LiveLocation
const updateLiveLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, status } = req.body;

    const [updated] = await LiveLocation.update(
      { latitude, longitude, status },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Live location not found or no changes made' });
    }

    const updatedLiveLocation = await LiveLocation.findByPk(id);
    res.status(200).json({
      message: 'Live location updated successfully',
      data: updatedLiveLocation,
    });
  } catch (error) {
    console.error('Error updating live location:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a LiveLocation
const deleteLiveLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await LiveLocation.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Live location not found' });
    }

    res.status(200).json({ message: 'Live location deleted successfully' });
  } catch (error) {
    console.error('Error deleting live location:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLiveLocation,
  getAllLiveLocations,
  getLiveLocationById,
  updateLiveLocation,
  deleteLiveLocation,
};
