const asyncHandler = require('express-async-handler');
const Bed = require('../bed/bedModel');
const logger = require('../utils/logger');

const addBeds = asyncHandler(async (req, res, next) => {
    const { wardName, wardId, wardType, bedNumber } = req.body;

    // Find the existing ward by its wardId and wardType
    let existingWard = await Bed.findOne({
        'wards.wardName': wardName,
        'wards.wardId': wardId,
        'wards.wardType': wardType,
    });

    // If the ward doesn't exist, create a new one
    if (!existingWard) {
        existingWard = new Bed({
            wards: [
                {
                    wardName,
                    wardId,
                    wardType,
                    beds: [],
                },
            ],
        });
    }

    // Get the current bed count in the ward
    const currentBeds = existingWard.wards[0].beds || [];

    if (bedNumber >= 0) {
        // Get the starting bed number
        const startingBedNumber =
            currentBeds.length > 0
                ? parseInt(currentBeds[currentBeds.length - 1].bedNumber.split('_')[1]) + 1
                : 1;

        // Add the specified number of beds to the existing or new ward
        for (let i = 1; i <= bedNumber; i++) {
            const newBedNumber = startingBedNumber + i - 1;
            const newBed = {
                bedNumber: `bed_${newBedNumber}`,
                status: 'available',
            };
            currentBeds.push(newBed);
        }

        // Update the beds array in the existing or newly created ward
        existingWard.wards[0].beds = currentBeds;

        // Save the updated or newly created ward
        await existingWard.save();
        logger.info('Added beds successfully'); // Log successful addition of beds

        res.status(200).json({ message: `Added ${bedNumber} beds to the specified ward successfully` });
    } else {
        const errorMessage = 'Invalid bed count found';
        logger.error(errorMessage); // Log the error
        next({ statusCode: 400, message: errorMessage }); // Pass error to error handler middleware
    }
});

const bedGet = asyncHandler(async (req, res, next) => {
    const bedss = await Bed.find();
    if (bedss.length > 0) {
        res.json(bedss);
    } else {
        const errorMessage = 'Invalid Patient Not Found';
        logger.error(errorMessage); // Log the error
        next({ statusCode: 404, message: errorMessage }); // Pass error to error handler middleware
    }
});

module.exports = { addBeds, bedGet };
