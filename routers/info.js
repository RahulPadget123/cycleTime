const express = require('express');
const router = express.Router();
const { handelCreateInfo,
    handelcreateInfoPage,
    handelLogout,
    handleDownloadPlant60Info,
    handleDownloadPlant63Info,
    handleDownloadPlant68Info,
    handleDownloadPlant58Info,
    handelSector68Info,
    handelSector60Info,
    handelSector63Info,
    handelSector58Info,
    handleDownloadProjectInfo,
    handelCreateUserBasicInfo,
    handelCreateBasicInfoPage,
    handelPreviewInfoPage58,
    handelPreviewInfoPage60,
    handelPreviewInfoPage63,
    handelPreviewInfoPage68,
} = require('../controllers/infio');
const {isLoggedIn,
    isChecked,
} = require('../middlewares/auth');

router.post("/createInfo/:userid",  handelCreateInfo);

router.get("/createInfo", isChecked, handelcreateInfoPage);

router.get("/logout", handelLogout);

router.get("/sector-60", handleDownloadPlant60Info);

router.get("/sector-63", handleDownloadPlant63Info);

router.get("/sector-68", handleDownloadPlant68Info);

router.get("/sector-58", handleDownloadPlant58Info);

router.get("/sector68Info", handelSector68Info);

router.get("/sector60Info", handelSector60Info);

router.get("/sector63Info", handelSector63Info);

router.get("/sector58Info", handelSector58Info);

router.get("/:plant/:project", handleDownloadProjectInfo);

router.post("/createUserBasicInfo/:userid", handelCreateUserBasicInfo);

router.get("/createUserBasicInfoPage", isLoggedIn, handelCreateBasicInfoPage);

router.get("/previewInfoPage58", handelPreviewInfoPage58);

router.get("/previewInfoPage60", handelPreviewInfoPage60);

router.get("/previewInfoPage63", handelPreviewInfoPage63);

router.get("/previewInfoPage68", handelPreviewInfoPage68);

module.exports = router;
