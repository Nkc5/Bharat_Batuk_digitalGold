const User = require('../../models/users');

class GetUserController {
  async getUserDetails(req, res) {
    try {
      const userId = req.params.id;


      // Find the user by their ID
      const user = await User.findById(userId);

      if (user) {
        res.json(user); // Return the user details as JSON
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = GetUserController;
