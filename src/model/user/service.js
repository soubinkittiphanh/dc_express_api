const User = require('../').user; // Adjust the path to your models
const Rider = require('../').rider; // Adjust the path to your models
const Merchant = require('../').merchant; // Adjust the path to your models
const bcrypt = require('bcrypt');
const { sequelizeDCExpress } = require('../../model')


// Create a new user
const createUser = async (req, res) => {
    try {
        const { loginId, password, status } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            loginId,
            password: hashedPassword,
            status
        });

        res.status(201).json({ message: 'User created successfully', data: user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ error: error.message });
    }
};

const registration = async (req, res) => {
    const t = await sequelizeDCExpress.transaction(); // Start a transaction
    try {
        const { loginId, password, status, customerType, additionalData } = req.body;

        if (!customerType || !['Rider', 'Merchant'].includes(customerType)) {
            return res.status(400).json({ error: 'Invalid customerType. Must be "Rider" or "Merchant".' });
        }

        if (!additionalData) {
            return res.status(400).json({ error: 'Missing additionalData for customer type.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user inside the transaction
        const user = await User.create(
            { loginId, password: hashedPassword, status },
            { transaction: t, returning: true } // Ensure user object is returned
        );

        let profile;

        if (customerType === 'Rider') {
            profile = await Rider.create(
                {
                    userId: user.id, // Associate Rider with User
                    name: additionalData.name,
                    phone: additionalData.phone,
                    email: additionalData.email || null, // Ensure it's null-safe
                    address: additionalData.address,
                    vehicleType: additionalData.vehicleType,
                    licenseNumber: additionalData.licenseNumber || null,
                    status: 'inactive',
                },
                { transaction: t, returning: true }
            );
        } else if (customerType === 'Merchant') {
            profile = await Merchant.create(
                {
                    userId: user.id, // Associate Merchant with User
                    shopName: additionalData.shopName,
                    whatsapp: additionalData.whatsapp,
                    address: additionalData.address,
                    latitude: additionalData.latitude || null,
                    longitude: additionalData.longitude || null,
                    serviceStatus: additionalData.serviceStatus || 'open',
                },
                { transaction: t, returning: true }
            );
        }

        // If everything is successful, commit the transaction
        await t.commit();

        res.status(201).json({
            message: 'User created successfully',
            data: {
                user,
                profile,
            },
        });
    } catch (error) {
        // Rollback transaction on error
        await t.rollback();

        console.error('Error creating user:', error);

        // Handle unique constraint violation (e.g., duplicate loginId or phone number)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'User with this loginId or phone already exists.' });
        }

        // Return a generic error
        res.status(400).json({ error: error.message });
    }
};



module.exports = {
    createUser,
    registration
}