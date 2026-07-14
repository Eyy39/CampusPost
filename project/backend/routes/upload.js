const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const imagekit = require("../config/imagekit");

router.post("/", upload.single("image"), async (req, res) => {
    try{
        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "campuspost"
        })
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;