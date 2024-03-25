// Import the User model
const { User } = require('../models');
// Import the signToken function from the auth utility
const { signToken } = require('../utils/auth');

module.exports = {
  // Retrieve a single user by their id or username
  async getSingleUser({ user = null, params }, res) {
    const foundUser = await User.findOne({
      $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this id!' });
    }

    res.json(foundUser);
  },

  // Create a new user, sign a token for them, and send it back (used in client/src/components/SignUpForm.js)
  async createUser({ body }, res) {
    const user = await User.create(body);

    if (!user) {
      return res.status(400).json({ message: 'Something went wrong!' });
    }

    const token = signToken(user);
    res.json({ token, user });
  },

  // Login a user, sign a token for them, and send it back (used in client/src/components/LoginForm.js)
  async login({ body }, res) {
    const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const correctPassword = await user.isCorrectPassword(body.password);

    if (!correctPassword) {
      return res.status(400).json({ message: 'Incorrect password!' });
    }

    const token = signToken(user);
    res.json({ token, user });
  },

  // Save a book to a user's `savedBooks` array by adding it (prevent duplicates)
  async saveBook({ user, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(400).json(error);
    }
  },

  // Remove a book from a user's `savedBooks` array
  async deleteBook({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedBooks: { bookId: params.bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    return res.json(updatedUser);
  },
};
