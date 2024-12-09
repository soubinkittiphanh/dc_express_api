const  User  = require('./model').user; // Adjust the path to your models
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');

// Login a user
const loginUser = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Find the user by loginId
    const user = await User.findOne({ where: { loginId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user.id, loginId: user.loginId, status: user.status }, // Payload
      process.env.JWT_SECRET || 'your_secret_key', // Secret key (use environment variables in production)
      { expiresIn: '1h' } // Token expiration
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        loginId: user.loginId,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
};

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

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { loginId, password, status } = req.body;

    // Hash the new password if provided
    const updates = {};
    if (loginId) updates.loginId = loginId;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (status) updates.status = status;

    const [updated] = await User.update(updates, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    const updatedUser = await User.findByPk(id);
    res.status(200).json({ message: 'User updated successfully', data: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
