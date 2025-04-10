const express = require('express');
const router = express.Router();
const { handelCreateInfo,
    handelcreateInfoPage,
    handelLogout,
    handleDownloadInfo,
} = require('../controllers/infio');
const {isLoggedIn} = require('../middlewares/auth');

router.post("/createInfo/:userid",  handelCreateInfo);

router.get("/createInfo", isLoggedIn, handelcreateInfoPage);

router.get("/logout", handelLogout);

router.get("/downloadInfo", handleDownloadInfo);


module.exports = router;