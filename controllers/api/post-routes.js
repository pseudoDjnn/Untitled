const router = require("express").Router();
const multer = require("multer");
const { Post, User, Comment } = require("../../models");

// GRAB ALL POSTS
router.get("/", async (req, res) => {
  try {
    const dbPostsData = await Post.findAll({
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          attributes: ["id", "comment", "created_at"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });
    const posts = dbPostsData.map((post) => post.get({ plain: true }));
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GRAB SINGLE POST
router.get("/:id", async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["created_at", "updated_at"] },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          attributes: ["id", "comment", "created_at"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });
    const post = dbPostData.get({ plain: true });
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/new-post", (req, res) => {
  const fielStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });
  const upload = multer({ storage: fielStorageEngine });
  router.post("/new-post", upload.single("image"), (req, res) => {
    res.send("Single file uploaded successfully.");
  });
});

// CREATE POST
router.post("/", async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      photo: req.body.photo,
      user_id: req.body.user_id,
    });
    res.json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: { id: req.params.id },
    });
    res.json(deletedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
