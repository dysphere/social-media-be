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
      });
        return res.status(200).json({user});
    }
    catch (error) {
      return res.status(500).json({message: "Could not get current user."});
    }
}

exports.toggleFollowUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
            include: {
                followedBy: true,
              },
          });
          const isFollow = (user) => user.id === req.user.id;
          const follows = user.followedBy.some(isFollow);
          if (!follows) {
          const follow_user = await prisma.user.update({
            where: {
                id: parseInt(req.params.id),
              },
              data: {
                followedBy: {
                  connect: {
                    id: req.user.id,
                  },
                },
              },
          });
          await prisma.user.update({
            where: {
                id: req.user.id,
              },
              data: {
                following: {
                  connect: {
                    id: parseInt(req.params.id),
                  },
                },
              },
          });
          return res.status(200).json({follow_user});
        }
        else {
          const unfollow_user = await prisma.user.update({
            where: {
                id: parseInt(req.params.id),
              },
              data: {
                followedBy: {
                  disconnect: {
                    id: req.user.id,
                  },
                },
              },
          });
          await prisma.user.update({
            where: {
                id: req.user.id,
              },
              data: {
                following: {
                  disconnect: {
                    id: parseInt(req.params.id),
                  },
                },
              },
          });
          return res.status(200).json({unfollow_user});
        }
    }
    catch (error) {
        return res.status(500).json({message: "Could not toggle follow user."});
    }
}