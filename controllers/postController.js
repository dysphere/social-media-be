const prisma = require("../db/prisma");

exports.getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });
        return res.status(200).json({posts});
    }
    catch(err) {
        return res.status(500).json({message: "Could not get posts."});
    }
}

exports.getFollowedPosts = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id,
              },
              include: {
                following: true,
              },
        });
        const followed = user.following.map((user) => user.id);
        const posts = await prisma.post.findMany({
            where: {
                authorId: { in: followed},
              },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return res.status(200).json({posts});
    }
    catch(err) {
        return res.status(500).json({message: "Could not get followed posts."});
    }
}

exports.getPost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: req.params.id,
              },
              include: {
                author: true, 
                comment: true,
                like: true,
              },
        });
        return res.status(200).json({post});
    }
    catch(err) {
        return res.status(500).json({message: "Could not get post."});
    }
}

exports.createPost = async (req, res) => {
    try {
        const post = await prisma.post.create({
            data: {
                content: req.body.content,
                authorId: req.user.id,
              },
        });
        return res.status(200).json({post});
    }
    catch(err) {
        return res.status(500).json({message: "Could not create post."});
    }
}

exports.updatePost = async (req, res) => {
    try {
        const post = await prisma.post.update({
            where: {
              id: parseInt(req.params.id),
            },
            data: {
              content: req.body.content,
            },
          })
        return res.status(200).json({post});
    }
    catch(err) {
        return res.status(500).json({message: "Could not update post."});
    }
}

exports.deletePost = async (req, res) => {
    try {
        const post = await prisma.post.delete({
            where: {
              id: parseInt(req.params.id),
            },
          })
        return res.status(200).json({post});
    }
    catch(err) {
        return res.status(500).json({message: "Could not delete post."});
    }
}

exports.toggleLikePost = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
            include: {
                like: true,
              },
          });
          const isLike = (user) => user.id === req.user.id;
          const likes = post.like.some(isLike);
          if (!likes) {
            const post = await prisma.post.update({
                where: {
                    id: parseInt(req.params.id),
                  },
                  data: {
                    like: {
                      connect: {
                        id: req.user.id,
                      },
                    },
                  },
                  include: {
                    like: true,
                  },
            });
            return res.status(200).json({post});
          }
          else {
            const post = await prisma.post.update({
                where: {
                    id: parseInt(req.params.id),
                  },
                  data: {
                    like: {
                      disconnect: {
                        id: req.user.id,
                      },
                    },
                  },
                  include: {
                    like: true,
                  },
            });
            return res.status(200).json({post});
          }
    }
    catch (error) {
        return res.status(500).json({message: "Could not toggle like on post."});
    }
}