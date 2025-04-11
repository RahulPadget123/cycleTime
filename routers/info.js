const express = require('express');
const router = express.Router();
const { handelCreateInfo,
    handelcreateInfoPage,
    handelLogout,
    handleDownloadPlant60Info,
    handleDownloadPlant63Info,
    handleDownloadPlant68Info,
    handleDownloadPlant58Info,
} = require('../controllers/infio');
const {isLoggedIn} = require('../middlewares/auth');

router.post("/createInfo/:userid",  handelCreateInfo);

router.get("/createInfo", isLoggedIn, handelcreateInfoPage);

router.get("/logout", handelLogout);

router.get("/sector60", handleDownloadPlant60Info);

router.get("/sector63", handleDownloadPlant63Info);

router.get("/sector68", handleDownloadPlant68Info);

router.get("/sector58", handleDownloadPlant58Info);


module.exports = router;
