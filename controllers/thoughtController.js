const { User, Thought, Reaction } = require('../models');

module.exports = {
    //getThoughts //GET
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //getSingleThought //GET
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({_id: req.params.thoughtId})
                .select('-___v');
            if (!thought) {
                return res.status(400).json({ message: 'No thought with that ID found' });
            }   
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //addThought //POST (associate to user's thoughts array field)
    async addThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
              { _id: req.body.userId },
              { $addToSet: { thoughts: thought._id } },
              { new: true }
            );
      
            if (!user) {
                await Thought.findOneAndDelete({_id: thought._id});
                return res
                    .status(404)
                    .json({ message: 'No user with that ID!' });
            }           
      
            res.json(thought);
          } catch (err) {
            console.log(err);
            res.status(500).json(err);
          }
    },
    //updateThought //PUT
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$set: req.body},
                {runValidators: true, new: true}
            );
            if (!thought) {
                return res.status(400).json({ message: 'No thought with that ID found' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //deleteThought //DELETE
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({_id: req.params.thoughtId});
            if (!thought) {
                return res.status(400).json({ message: 'No thought with that ID found'});
            }
            await Thought.deleteMany({_id: { $in: thought.reactions } });
            await User.findOneAndUpdate(
                {username: req.body.username},
                {$pull: {thoughts: {_id: req.params.thoughtId}}})
            res.json("Thought has been removed!");
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //addReaction //POST
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { new: true }
            );
        
            if (!thought) {
                return res
                .status(404)
                .json({ message: 'No thought with that ID found' });
            }
        
            res.json(thought);
            } catch (err) {
            console.log(err);
            res.status(500).json(err);
              }
    },
    //deleteReaction //DELETE
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$pull: {reactions: {_id: req.params.reactionId}}});
            if (!thought) {
                return res.status(400).json({ message: 'No thought with that ID found'});
            }
            res.json('Reaction has been removed!');
        } catch (err) {
            res.status(500).json(err);
        }
    }
};