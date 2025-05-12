const prisma = require("../db/prisma");

exports.getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                id: 'asc',
            },
            include: {
              profile: true,
            },
        });
        return res.status(201).json({users});
       } catch (error) {
        return res.status(500).json({message: "Could not get users."});
         }
}

exports.getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
          include: {
            profile: true,
          },
        });
        return res.status(200).json({user});
    }
    catch (error) {
      return res.status(500).json({message: "Could not get user."});
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        include: {
          profile: true,
        }
      });
        return res.status(200).json({user});
    }
    catch (error) {
      return res.status(500).json({message: "Could not get current user."});
    }
}

exports.toggleFollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followeeId = parseInt(req.params.id);

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followeeId: {
            followerId,
            followeeId,
          },
        },
      });

      return res.status(200).json({ message: 'Unfollowed' });
    } else {
      await prisma.follow.create({
        data: {
          follower: { connect: { id: followerId } },
          followee: { connect: { id: followeeId } },
        },
      });

      return res.status(200).json({ message: 'Followed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Could not toggle follow user.' });
  }
}