const prisma = require("../db/prisma");
const { uploadToCloudinary } = require("../storage/cloudinary_config");

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
        const followExists = await prisma.follow.findUnique({
          where: {
            followerId_followeeId: {
              followerId: req.user.id,
              followeeId: parseInt(req.params.id),
            },
          },
        });
        const isFollowing = !!followExists;
        return res.status(200).json({profile,
          isFollowing});
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

exports.uploadPic = async (req, res) => {
   try {
        const picUrl = await uploadToCloudinary(req.file.path);
        const profile = await prisma.profile.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: {
            avatar: picUrl,
          },
        });
        return res.status(200).json({profile});
       } catch (error) {
          console.error(error);
         }
}