const prisma = require("../db/prisma");

exports.getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        return res.status(201).json({users});
       } catch (error) {
          console.error(error);
          next(error);
         }
}

exports.getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
          where: {
            id: req.params.id,
          },
        });
        return res.status(200).json({user});
    }
    catch (error) {
      console.error(error);
          next(error);
    }
}

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
        });
        return res.status(200).json({user});
    }
    catch (error) {
      console.error(error);
          next(error);
    }
}

exports.toggleFollowUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
              id: req.params.id,
            },
            include: {
                followedBy: true,
              },
          });
          const follows = user.followedBy;
          return res.status(200).json();
    }
    catch (error) {
      console.error(error);
          next(error);
    }
}