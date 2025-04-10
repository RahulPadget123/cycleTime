const infoModel = require('../models/info');
const userModel = require('../models/user');
const adminModel = require('../models/admin');
const { Parser } = require('json2csv');

async function handelCreateInfo(req, res){
    let {name, stationNumber, stationName, ct1, ct2, ct3, ct4, ct5, numberOfStation, numberOfDevices, numberOfManPower, numberOfMachine} = req.body;
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

    const user = await userModel.findOne({_id: req.params.userid});
    const info = await infoModel.create({
        name,
        user: user._id,
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
        finalAvgCt
    });
    user.info.push(info._id);
    await user.save();
    return res.redirect("/info/createInfo");
}

async function handelcreateInfoPage(req, res){
    let user = await userModel.findOne({email: req.user.email});
    return res.render("infoPage",{user});
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


async function handleDownloadInfo(req, res) {
    try {
        // Fetch all data from infoModel
        const infoData = await infoModel.find({});

        // Check if data exists
        if (!infoData || infoData.length === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                msg: 'No data found in the database'
            });
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
                finalAvgCt 
            } = info;
            return { 
                Name: name,              // Match csvFields case
                User: user,             // Match csvFields case
                StationNumber: stationNumber,
                StationName: stationName,
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
                FinalAvgCt: finalAvgCt
            };
        });

        // Log mapped data for debugging
        console.log('Mapped details:', JSON.stringify(details, null, 2));

        // Define CSV fields
        const csvFields = [
            'Name',
            'User',
            'StationNumber',
            'StationName',
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
            'FinalAvgCt'
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
    handleDownloadInfo,
}