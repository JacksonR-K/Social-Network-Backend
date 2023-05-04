const { User, Thought } = require('../models');

module.exports = {
    //getUsers (GET)
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //getSingleUser (GET)
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({_id: req.params.userId})
                .select('-___v');
            if (!user) {
                return res.status(400).json({ message: 'No user with that ID found' });
            }   
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //createUser (POST)
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //updateUser (PUT)
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$set: req.body},
                {runValidators: true, new: true}
            );
            if (!user) {
                return res.status(400).json({ message: 'No user with that ID found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //deleteUser (DELETE)
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({_id: req.params.userId});
            if (!user) {
                return res.status(400).json({ message: 'No user with that ID found'});
            }
            await Thought.deleteMany({_id: { $in: user.thoughts } });
            res.json("User deleted!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //addFriend (POST)
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.body._id } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID found' });
            }
            res.json('New friend added!');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    //deleteFriend (DELETE)
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$pull: {friends: req.body._id}});
            if (!user) {
                return res.status(400).json({ message: 'No user with that ID found'});
            }
            res.json("Friend removed!")
        } catch (err) {
            res.status(500).json(err);
        }
    }
};