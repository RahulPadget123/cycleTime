const infoModel = require('../models/info');
const userModel = require('../models/user');
const adminModel = require('../models/admin');
const basicInfoModel = require('../models/basicInfo');
const jwt = require('jsonwebtoken');
const { Parser } = require('json2csv');

async function handelCreateInfo(req, res){
    let {stationNumber, stationName, ct1, ct2, ct3, ct4, ct5, numberOfStation, numberOfDevices, numberOfManPower, numberOfMachine, numberOfJigs, taktTime} = req.body;
    let Ct1A = Number(ct1);
    let Ct2A = Number(ct2);
    let Ct3A = Number(ct3);
    let Ct4A = Number(ct4);
    let Ct5A = Number(ct5);
    let avgCt = (Ct1A+Ct2A+Ct3A+Ct4A+Ct5A)/5;

    let noSt = Number(numberOfStation);
    let noDiv = Number(numberOfDevices);
    let noMp = Number(numberOfManPower);
    let noMac = Number(numberOfMachine);

    let largest;

    if (noSt >= noDiv && noSt >= noMp && noSt >= noMac) {
        largest = noSt;
    } else if (noDiv >= noSt && noDiv >= noMp && noDiv >= noMac) {
        largest = noDiv;
    } else if (noMp >= noSt && noMp >= noDiv && noMp >= noMac) {
        largest = noMp;
    } else {
        largest = noMac;
    }

    

    let finalAvgCt = avgCt/largest;
    let uph100Per = 3600/finalAvgCt;
    let uph90Per = uph100Per*0.9;

    const user = await basicInfoModel.findOne({_id: req.params.userid});
    const info = await infoModel.create({
        name: user.name,
        user: user._id,
        plant: user.plant,
        project: user.project,
        model: user.model,
        section: user.section,
        stationNumber,
        stationName,
        ct1,
        ct2,
        ct3,
        ct4,
        ct5,
        avgCt,
        numberOfStation,
        numberOfDevices,
        numberOfManPower,
        numberOfMachine,
        numberOfJigs,
        finalAvgCt,
        taktTime,
        uph100Per,
        uph90Per,
    });
    user.infos.push(info._id);
    await user.save();
    return res.redirect("/info/createInfo");
}

//newly added
async function handelCreateUserBasicInfo(req, res){
    let {name, plant, project, model, section} = req.body;
    // const user = await userModel.findOne({email: req.user.email});
    const basicInfo = await basicInfoModel.create({
        name,
        // user: user._id,
        plant,
        project,
        model,
        section
    });
    // user.userInfo.push(basicInfo._id);
    // await user.save();
    let tokenInfo = jwt.sign({userId: basicInfo._id}, "hello");
    res.cookie("token", tokenInfo);
    return res.redirect("/info/createInfo");
}

async function handelCreateBasicInfoPage(req, res){
    let user = await userModel.findOne({email: req.user.email});
    res.cookie("token", "");
    return res.render("mainInfoPage", {user});

}

async function handelPreviewInfoPage58(req,res){
    let info = await infoModel.find({plant: "sector-58" || "sector 58" || "Sector 58" || "Sector-58"});
    return res.render("preview",{info});
}

async function handelPreviewInfoPage60(req,res){
    let info = await infoModel.find({plant: "sector-60" || "sector 60" || "Sector 60" || "Sector-60"});
    return res.render("preview",{info});
}

async function handelPreviewInfoPage63(req,res){
    let info = await infoModel.find({plant: "sector-63" || "sector 63" || "Sector 63" || "Sector-63"});
    return res.render("preview",{info});
}

async function handelPreviewInfoPage68(req,res){
    let info = await infoModel.find({plant: "sector-68" || "sector 68" || "Sector 68" || "Sector-68"});
    return res.render("preview",{info});
}

async function handelDeleteInfo(req, res){
    await infoModel.findOneAndDelete({_id: req.params.deleteInfoId});
    return res.redirect("/info/createInfo");
}

//end of newly added

async function handelcreateInfoPage(req, res){
    let user = await basicInfoModel.findOne({_id: req.user.userId});
    return res.render("infoPage", {user});
}

async function handelLogout(req, res){
    res.cookie("token","");
    return res.redirect("/");
}

// async function handeldownloadInfo(req, res){
//     try{
//         let details = [];
//         var infoData = await infoModel.find({});
//         infoData.forEach((info) =>{
//             const {name, user, stationNumber, stationName, ct1Oct, ct1OMct, ct2, ct3, ct4, ct5, numberOfStation, numberOfDevices, numberOfManPower, numberOfMachine} = info;
//             details.push({name, user, stationNumber, stationName, ct1Oct, ct1OMct, ct2, ct3, ct4, ct5, numberOfStation, numberOfDevices, numberOfManPower, numberOfMachine});
//         });

//         const csvFields = ['name','user','stationNumber','stationName','ct1Oct','ct1OMct','ct2','ct3','ct4','ct5','numberOfStation','numberOfDevices','numberOfManPower','numberOfMachine'];
//         const csvParser = new CsvParser({ csvFields });
//         const csvData = csvParser.parse(details);

//         res.setHeader("Content-Type","text/csv");
//         res.setHeader("Content-Disposition","attatchment: filename=usersData.csv");

//         res.status(200).end(csvData);

//     }catch(error){
//         res.send({status:400, success:false, msg:error.message});
//     }
// }


async function handleDownloadPlant60Info(req, res) {
    try {
        // Fetch all data from infoModel
        const infoData = await infoModel.find({plant: "sector-60"});

        // Check if data exists
        if (!infoData || infoData.length === 0) {
            // return res.status(404).json({
            //     status: 404,
            //     success: false,
            //     msg: 'No data found in the database'
            // });
            return res.redirect("/info/createInfo");
        }

        // Log raw data for debugging
        console.log('Raw data from database:', JSON.stringify(infoData, null, 2));

        // Map data to an array of objects
        const details = infoData.map(info => {
            const { 
                name, 
                user, // Assuming 'user' is a field in your model
                stationNumber, 
                stationName,
                plant,
                project,
                model,
                section,  
                ct1, 
                ct2, 
                ct3, 
                ct4, 
                ct5, 
                avgCt,
                numberOfStation, 
                numberOfDevices, 
                numberOfManPower, 
                numberOfMachine,
                numberOfJigs,
                finalAvgCt,
                taktTime,
                uph100Per,
                uph90Per, 
            } = info;
            return { 
                Name: name,              // Match csvFields case
                User: user,             // Match csvFields case
                StationNumber: stationNumber,
                StationName: stationName,
                Plant: plant,
                Project: project,
                Model: model,
                Section: section,
                Ct1: ct1,
                Ct2: ct2,
                Ct3: ct3,
                Ct4: ct4,
                Ct5: ct5,
                AvgCt: avgCt,
                NumberOfStation: numberOfStation,
                NumberOfDevices: numberOfDevices,
                NumberOfManPower: numberOfManPower,
                NumberOfMachine: numberOfMachine,
                NumberOfJigs: numberOfJigs,
                FinalAvgCt: finalAvgCt,
                TaktTime: taktTime,
                Uph100Per: uph100Per,
                Uph90Per: uph90Per
            };
        });

        // Log mapped data for debugging
        console.log('Mapped details:', JSON.stringify(details, null, 2));

        // Define CSV fields
        const csvFields = [
            'StationNumber',
            'StationName',
            'Plant',
            'Project',
            'Model',
            'Section',
            'Ct1',
            'Ct2',
            'Ct3',
            'Ct4',
            'Ct5',
            'AvgCt',
            'NumberOfStation',
            'NumberOfDevices',
            'NumberOfManPower',
            'NumberOfMachine',
            'NumberOfJigs',
            'FinalAvgCt',
            'TaktTime',
            'Uph100Per',
            'Uph90Per',
            'Remarks'
        ];

        // Create CSV parser and parse data
        const csvParser = new Parser({ fields: csvFields });
        const csvData = csvParser.parse(details);

        // Log CSV data for debugging
        console.log('Generated CSV data:', csvData);

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=usersData.csv');

        res.status(200).send(csvData);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).json({ 
            status: 400, 
            success: false, 
            msg: error.message 
        });
    }
}



async function handleDownloadPlant63Info(req, res) {
    try {
        // Fetch all data from infoModel
        const infoData = await infoModel.find({plant: "sector-63"});

        // Check if data exists
        if (!infoData || infoData.length === 0) {
            // return res.status(404).json({
            //     status: 404,
            //     success: false,
            //     msg: 'No data found in the database'
            // });
            return res.redirect("/info/createInfo");
        }

        // Log raw data for debugging
        console.log('Raw data from database:', JSON.stringify(infoData, null, 2));

        // Map data to an array of objects
        const details = infoData.map(info => {
            const { 
                name, 
                user, // Assuming 'user' is a field in your model
                stationNumber, 
                stationName,
                plant,
                project,
                model,
                section,    
                ct1, 
                ct2, 
                ct3, 
                ct4, 
                ct5, 
                avgCt,
                numberOfStation, 
                numberOfDevices, 
                numberOfManPower, 
                numberOfMachine,
                numberOfJigs,
                finalAvgCt,
                taktTime,
                uph100Per,
                uph90Per, 
            } = info;
            return { 
                Name: name,              // Match csvFields case
                User: user,             // Match csvFields case
                StationNumber: stationNumber,
                StationName: stationName,
                Plant: plant,
                Project: project,
                Model: model,
                Section: section,
                Ct1: ct1,
                Ct2: ct2,
                Ct3: ct3,
                Ct4: ct4,
                Ct5: ct5,
                AvgCt: avgCt,
                NumberOfStation: numberOfStation,
                NumberOfDevices: numberOfDevices,
                NumberOfManPower: numberOfManPower,
                NumberOfMachine: numberOfMachine,
                NumberOfJigs: numberOfJigs,
                FinalAvgCt: finalAvgCt,
                TaktTime: taktTime,
                Uph100Per: uph100Per,
                Uph90Per: uph90Per
            };
        });

        // Log mapped data for debugging
        console.log('Mapped details:', JSON.stringify(details, null, 2));

        // Define CSV fields
        const csvFields = [
            'StationNumber',
            'StationName',
            'Plant',
            'Project',
            'Model',
            'Section',
            'Ct1',
            'Ct2',
            'Ct3',
            'Ct4',
            'Ct5',
            'AvgCt',
            'NumberOfStation',
            'NumberOfDevices',
            'NumberOfManPower',
            'NumberOfMachine',
            'NumberOfJigs',
            'FinalAvgCt',
            'TaktTime',
            'Uph100Per',
            'Uph90Per',
            'Remarks'
        ];

        // Create CSV parser and parse data
        const csvParser = new Parser({ fields: csvFields });
        const csvData = csvParser.parse(details);

        // Log CSV data for debugging
        console.log('Generated CSV data:', csvData);

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=usersData.csv');

        res.status(200).send(csvData);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).json({ 
            status: 400, 
            success: false, 
            msg: error.message 
        });
    }
}



async function handleDownloadPlant68Info(req, res) {
    try {
        // Fetch all data from infoModel
        const infoData = await infoModel.find({plant: "sector-68"});

        // Check if data exists
        if (!infoData || infoData.length === 0) {
            // return res.status(404).json({
            //     status: 404,
            //     success: false,
            //     msg: 'No data found in the database'
            // });
            return res.redirect("/info/createInfo");
        }

        // Log raw data for debugging
        console.log('Raw data from database:', JSON.stringify(infoData, null, 2));

        // Map data to an array of objects
        const details = infoData.map(info => {
            const { 
                name, 
                user, // Assuming 'user' is a field in your model
                stationNumber, 
                stationName,
                plant,
                project,
                model,
                section,    
                ct1, 
                ct2, 
                ct3, 
                ct4, 
                ct5, 
                avgCt,
                numberOfStation, 
                numberOfDevices, 
                numberOfManPower, 
                numberOfMachine,
                numberOfJigs,
                finalAvgCt,
                taktTime,
                uph100Per,
                uph90Per, 
            } = info;
            return { 
                Name: name,              // Match csvFields case
                User: user,             // Match csvFields case
                StationNumber: stationNumber,
                StationName: stationName,
                Plant: plant,
                Project: project,
                Model: model,
                Section: section,
                Ct1: ct1,
                Ct2: ct2,
                Ct3: ct3,
                Ct4: ct4,
                Ct5: ct5,
                AvgCt: avgCt,
                NumberOfStation: numberOfStation,
                NumberOfDevices: numberOfDevices,
                NumberOfManPower: numberOfManPower,
                NumberOfMachine: numberOfMachine,
                NumberOfJigs: numberOfJigs,
                FinalAvgCt: finalAvgCt,
                TaktTime: taktTime,
                Uph100Per: uph100Per,
                Uph90Per: uph90Per
            };
        });

        // Log mapped data for debugging
        console.log('Mapped details:', JSON.stringify(details, null, 2));

        // Define CSV fields
        const csvFields = [
            'StationNumber',
            'StationName',
            'Plant',
            'Project',
            'Model',
            'Section',
            'Ct1',
            'Ct2',
            'Ct3',
            'Ct4',
            'Ct5',
            'AvgCt',
            'NumberOfStation',
            'NumberOfDevices',
            'NumberOfManPower',
            'NumberOfMachine',
            'NumberOfJigs',
            'FinalAvgCt',
            'TaktTime',
            'Uph100Per',
            'Uph90Per',
            'Remarks'
        ];

        // Create CSV parser and parse data
        const csvParser = new Parser({ fields: csvFields });
        const csvData = csvParser.parse(details);

        // Log CSV data for debugging
        console.log('Generated CSV data:', csvData);

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=usersData.csv');

        res.status(200).send(csvData);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).json({ 
            status: 400, 
            success: false, 
            msg: error.message 
        });
    }
}

async function handleDownloadPlant58Info(req, res) {
    try {
        // Fetch all data from infoModel
        const infoData = await infoModel.find({plant: "sector-58"});

        // Check if data exists
        if (!infoData || infoData.length === 0) {
            // return res.status(404).json({
            //     status: 404,
            //     success: false,
            //     msg: 'No data found in the database'
            // });
            return res.redirect("/info/createInfo");
        }

        // Log raw data for debugging
        console.log('Raw data from database:', JSON.stringify(infoData, null, 2));

        // Map data to an array of objects
        const details = infoData.map(info => {
            const { 
                name, 
                user, // Assuming 'user' is a field in your model
                stationNumber, 
                stationName,
                plant,
                project,
                model,
                section,  
                ct1, 
                ct2, 
                ct3, 
                ct4, 
                ct5, 
                avgCt,
                numberOfStation, 
                numberOfDevices, 
                numberOfManPower, 
                numberOfMachine,
                numberOfJigs,
                finalAvgCt,
                taktTime,
                uph100Per,
                uph90Per, 
            } = info;
            return { 
                Name: name,              // Match csvFields case
                User: user,             // Match csvFields case
                StationNumber: stationNumber,
                StationName: stationName,
                Plant: plant,
                Project: project,
                Model: model,
                Section: section,
                Ct1: ct1,
                Ct2: ct2,
                Ct3: ct3,
                Ct4: ct4,
                Ct5: ct5,
                AvgCt: avgCt,
                NumberOfStation: numberOfStation,
                NumberOfDevices: numberOfDevices,
                NumberOfManPower: numberOfManPower,
                NumberOfMachine: numberOfMachine,
                NumberOfJigs: numberOfJigs,
                FinalAvgCt: finalAvgCt,
                TaktTime: taktTime,
                Uph100Per: uph100Per,
                Uph90Per: uph90Per
            };
        });

        // Log mapped data for debugging
        console.log('Mapped details:', JSON.stringify(details, null, 2));

        // Define CSV fields
        const csvFields = [
            'StationNumber',
            'StationName',
            'Plant',
            'Project',
            'Model',
            'Section',
            'Ct1',
            'Ct2',
            'Ct3',
            'Ct4',
            'Ct5',
            'AvgCt',
            'NumberOfStation',
            'NumberOfDevices',
            'NumberOfManPower',
            'NumberOfMachine',
            'NumberOfJigs',
            'FinalAvgCt',
            'TaktTime',
            'Uph100Per',
            'Uph90Per',
            'Remarks'
        ];

        // Create CSV parser and parse data
        const csvParser = new Parser({ fields: csvFields });
        const csvData = csvParser.parse(details);

        // Log CSV data for debugging
        console.log('Generated CSV data:', csvData);

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=usersData.csv');

        res.status(200).send(csvData);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).json({ 
            status: 400, 
            success: false, 
            msg: error.message 
        });
    }
}


async function handelSector68Info(req, res){
    let info = await infoModel.find({plant: "sector-68" || "sector 68" || "Sector 68" || "Sector-68"});
    // console.log(info);
    if(!info) return res.redirect("/info/createInfo");
    let sector = "sector-68";
    let project1;
    let project2;
    let project3;
    let project4;
    let project5;
    let project6;
    info.forEach((item)=>{
        if(item.project == "Xiaomi"){
            project1 = item.project;
        }else if(item.project == "Compal"){
            project2 = item.project;
        }else if(item.project == "Lenovo"){
            project3 = item.project;
        }else if(item.project == "Moto-SMT"){
            project4 = item.project;
        }else if(item.project == "Jio"){
            project5 = item.project;
        }else if(item.project == "Acer"){
            project6 = item.project;
        }
    })
    return res.render("downloadInfoPage",{project1, project2, project3, project4, project5, project6, sector});
}

async function handelSector60Info(req, res){
    let info = await infoModel.find({plant: "sector-60" || "sector 60" || "Sector 60" || "Sector-60"});
    // console.log(info);
    if(!info) return res.redirect("/info/createInfo");
    let sector = "sector-60";
    let project1;
    let project2;
    let project3;
    let project4;
    let project5;
    let project6;
    info.forEach((item)=>{
        if(item.project == "Xiaomi"){
            project1 = item.project;
        }else if(item.project == "Compal"){
            project2 = item.project;
        }else if(item.project == "Lenovo"){
            project3 = item.project;
        }else if(item.project == "Moto-SMT"){
            project4 = item.project;
        }else if(item.project == "Jio"){
            project5 = item.project;
        }else if(item.project == "Acer"){
            project6 = item.project;
        }
    })
    return res.render("downloadInfoPage",{project1, project2, project3, project4, project5, project6, sector});
}

async function handelSector63Info(req, res){
    let info = await infoModel.find({plant: "sector-63" || "sector 63" || "Sector 63" || "Sector-63"});
    // console.log(info);
    if(!info) return res.redirect("/info/createInfo");
    let sector = "sector-63";
    let project1;
    let project2;
    let project3;
    let project4;
    let project5;
    let project6;
    info.forEach((item)=>{
        if(item.project == "Xiaomi"){
            project1 = item.project;
        }else if(item.project == "Compal"){
            project2 = item.project;
        }else if(item.project == "Lenovo"){
            project3 = item.project;
        }else if(item.project == "Moto-SMT"){
            project4 = item.project;
        }else if(item.project == "Jio"){
            project5 = item.project;
        }else if(item.project == "Acer"){
            project6 = item.project;
        }
    })
    return res.render("downloadInfoPage",{project1, project2, project3, project4, project5, project6, sector});
}

async function handelSector58Info(req, res){
    let info = await infoModel.find({plant: "sector-58" || "sector 58" || "Sector 58" || "Sector-58"});
    // console.log(info);
    if(!info) return res.redirect("/info/createInfo");
    let sector = "sector-58";
    let project1;
    let project2;
    let project3;
    let project4;
    let project5;
    let project6;
    info.forEach((item)=>{
        if(item.project == "Xiaomi"){
            project1 = item.project;
        }else if(item.project == "Compal"){
            project2 = item.project;
        }else if(item.project == "Lenovo"){
            project3 = item.project;
        }else if(item.project == "Moto-SMT"){
            project4 = item.project;
        }else if(item.project == "Jio"){
            project5 = item.project;
        }else if(item.project == "Acer"){
            project6 = item.project;
        }
    })
    return res.render("downloadInfoPage",{project1, project2, project3, project4, project5, project6, sector});
}

async function handleDownloadProjectInfo(req, res) {
    try {
        // Fetch all data from infoModel
        const infoData = await infoModel.find({plant: req.params.plant, project: req.params.project});

        // Check if data exists
        if (!infoData || infoData.length === 0) {
            // return res.status(404).json({
            //     status: 404,
            //     success: false,
            //     msg: 'No data found in the database'
            // });
            return res.redirect("/info/createInfo");
        }

        // Log raw data for debugging
        console.log('Raw data from database:', JSON.stringify(infoData, null, 2));

        // Map data to an array of objects
        const details = infoData.map(info => {
            const { 
                name, 
                user, // Assuming 'user' is a field in your model
                stationNumber, 
                stationName,
                plant,
                project,
                model,
                section,  
                ct1, 
                ct2, 
                ct3, 
                ct4, 
                ct5, 
                avgCt,
                numberOfStation, 
                numberOfDevices, 
                numberOfManPower, 
                numberOfMachine,
                numberOfJigs,
                finalAvgCt,
                taktTime,
                uph100Per,
                uph90Per, 
            } = info;
            return { 
                Name: name,              // Match csvFields case
                User: user,             // Match csvFields case
                StationNumber: stationNumber,
                StationName: stationName,
                Plant: plant,
                Project: project,
                Model: model,
                Section: section,
                Ct1: ct1,
                Ct2: ct2,
                Ct3: ct3,
                Ct4: ct4,
                Ct5: ct5,
                AvgCt: avgCt,
                NumberOfStation: numberOfStation,
                NumberOfDevices: numberOfDevices,
                NumberOfManPower: numberOfManPower,
                NumberOfMachine: numberOfMachine,
                NumberOfJigs: numberOfJigs,
                FinalAvgCt: finalAvgCt,
                TaktTime: taktTime,
                Uph100Per: uph100Per,
                Uph90Per: uph90Per
            };
        });

        // Log mapped data for debugging
        console.log('Mapped details:', JSON.stringify(details, null, 2));

        // Define CSV fields
        const csvFields = [
            'StationNumber',
            'StationName',
            'Plant',
            'Project',
            'Model',
            'Section',
            'Ct1',
            'Ct2',
            'Ct3',
            'Ct4',
            'Ct5',
            'AvgCt',
            'NumberOfStation',
            'NumberOfDevices',
            'NumberOfManPower',
            'NumberOfMachine',
            'NumberOfJigs',
            'FinalAvgCt',
            'TaktTime',
            'Uph100Per',
            'Uph90Per',
            'Remarks'
        ];

        // Create CSV parser and parse data
        const csvParser = new Parser({ fields: csvFields });
        const csvData = csvParser.parse(details);

        // Log CSV data for debugging
        console.log('Generated CSV data:', csvData);

        // Set response headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=usersData.csv');

        res.status(200).send(csvData);

    } catch (error) {
        console.error('Error:', error.message);
        res.status(400).json({ 
            status: 400, 
            success: false, 
            msg: error.message 
        });
    }
}


module.exports = {
    handelCreateInfo,
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
    handelDeleteInfo,
}
