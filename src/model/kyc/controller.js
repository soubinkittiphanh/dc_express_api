const KYC = require('..').kyc; // Adjust the path to your models
const Rider = require('..').rider; // Adjust the path to your models

// Create a new KYC record
const createKYC = async (req, res) => {
  try {
    const { riderId, ...kycData } = req.body;
    const rider = await Rider.findByPk(riderId);

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    const kyc = await KYC.create({ ...kycData, riderId });
    res.status(201).json({ message: 'KYC record created successfully', data: kyc });
  } catch (error) {
    console.error('Error creating KYC record:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all KYC records
const getAllKYC = async (req, res) => {
  try {
    const kycs = await KYC.findAll({ include: Rider });
    res.status(200).json({ data: kycs });
  } catch (error) {
    console.error('Error fetching KYC records:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a KYC record by ID
const getKYCById = async (req, res) => {
  try {
    const { id } = req.params;
    const kyc = await KYC.findByPk(id, { include: Rider });

    if (!kyc) {
      return res.status(404).json({ message: 'KYC record not found' });
    }

    res.status(200).json({ data: kyc });
  } catch (error) {
    console.error('Error fetching KYC record:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a KYC record
const updateKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await KYC.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'KYC record not found or no changes made' });
    }

    const updatedKYC = await KYC.findByPk(id, { include: Rider });
    res.status(200).json({ message: 'KYC record updated successfully', data: updatedKYC });
  } catch (error) {
    console.error('Error updating KYC record:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a KYC record
const deleteKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await KYC.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'KYC record not found' });
    }

    res.status(200).json({ message: 'KYC record deleted successfully' });
  } catch (error) {
    console.error('Error deleting KYC record:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createKYC,
  getAllKYC,
  getKYCById,
  updateKYC,
  deleteKYC,
};
