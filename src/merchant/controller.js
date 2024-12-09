const  Merchant  = require('../model').merchant; // Adjust the path to your models

// Create a new merchant
const createMerchant = async (req, res) => {
  try {
    const merchant = await Merchant.create(req.body);
    res.status(201).json({ message: 'Merchant created successfully', data: merchant });
  } catch (error) {
    console.error('Error creating merchant:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all merchants
const getAllMerchants = async (req, res) => {
  try {
    const merchants = await Merchant.findAll();
    res.status(200).json({ data: merchants });
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a merchant by ID
const getMerchantById = async (req, res) => {
  try {
    const { id } = req.params;
    const merchant = await Merchant.findByPk(id);

    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.status(200).json({ data: merchant });
  } catch (error) {
    console.error('Error fetching merchant:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a merchant
const updateMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Merchant.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Merchant not found or no changes made' });
    }

    const updatedMerchant = await Merchant.findByPk(id);
    res.status(200).json({ message: 'Merchant updated successfully', data: updatedMerchant });
  } catch (error) {
    console.error('Error updating merchant:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a merchant
const deleteMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Merchant.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    res.status(200).json({ message: 'Merchant deleted successfully' });
  } catch (error) {
    console.error('Error deleting merchant:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMerchant,
  getAllMerchants,
  getMerchantById,
  updateMerchant,
  deleteMerchant,
};
