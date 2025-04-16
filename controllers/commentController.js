const prisma = require("../db/prisma");

exports.getPostComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            where: {postId: parseInt(req.params.id)},
        });
        return res.status(200).json({comments});
    }
    catch(err) {
        return res.status(500).json({message: "Could not get comments."});
    }
}

exports.createPostComment = async (req, res) => {
    try {
        const comment = await prisma.comment.create({
            data: {
              content: req.body.content,
              authorId: req.user.id,
              postId: parseInt(req.params.id),
            },
          });
          return res.status(200).json({comment});
    }
    catch(err) {
        return res.status(500).json({message: "Could not create comment."});
    }
}

exports.updatePostComment = async (req, res) => {
    try {
        const comment = await prisma.comment.update({
            where: {
              id: parseInt(req.params.id),
            },
            data: {
              content: req.body.content,
            },
          });
          return res.status(200).json({comment});
    }
    catch(err) {
        return res.status(500).json({message: "Could not update comment."});
    }
}

exports.deletePostComment = async (req, res) => {
    try {
        const comment = await prisma.comment.delete({
            where: {
              id: parseInt(req.params.id),
            },
          });
          return res.status(200).json({comment});
    }
    catch(err) {
        return res.status(500).json({message: "Could not delete comment."});
    }
}