const prisma = require("../db/prisma");

exports.getProfile = async (req, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: {
                id: parseInt(req.params.id),
              },
              include: {
                user: {
                  include: {
                    following: {
                      include: {
                        follower: true, 
                        followee: true,
                      },
                    },
                    followedBy: {
                      include: {
                        followee: true, 
                        follower: true,
                      },
                    },
                    posts: {
                      include: {
                        like: true,
                        comment: true,
                      },
                    },
                  },
                },
              },
        });
        return res.status(200).json({profile});
    }
    catch(err) {
        return res.status(500).json({message: "Could not get profile."});
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const profile = await prisma.profile.update({
            where: {
                id: parseInt(req.params.id),
              },
              data: {
                bio: req.body.bio,
              },
        });
        return res.status(200).json({profile});
    }
    catch(err) {
        return res.status(500).json({message: "Could not get profile."});
    }
}