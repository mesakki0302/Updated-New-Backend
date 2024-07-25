const asyncHandler = require('express-async-handler');
const moment = require('moment');
const Bed = require('../bed/bedModel'); // Assuming you have the Bed model defined

// Get bed status per ward and admission statistics
// const getBedStatusAndAdmissionStatistics = asyncHandler(async (req, res) => {
//   const bedsData = await Bed.findOne(); // Assuming you have only one document with all beds

//   if (!bedsData) {
//     return res.status(404).json({ message: 'No bed data found.' });
//   }

//   const thisWeekStart = moment().startOf('isoWeek');
//   const thisMonthStart = moment().startOf('month');

//   const bedStatusPerWard = {};

//   bedsData.wards.forEach((ward) => {
//     const wardName = ward.name || ward.wardId; // Use wardId if name is undefined
//     let occupiedBedsThisWeek = 0;
//     let occupiedBedsThisMonth = 0;

//     ward.beds.forEach((bed) => {
//       if (bed.status === 'occupied') {
//         const occupiedDate = moment(bed.occupiedTimestamp);
//         if (occupiedDate.isSameOrAfter(thisWeekStart, 'day')) {
//           occupiedBedsThisWeek++;
//         }
//         if (occupiedDate.isSameOrAfter(thisMonthStart, 'day')) {
//           occupiedBedsThisMonth++;
//         }
//       }
//     });

//     const availableBeds = ward.beds.filter((bed) => bed.status === 'available').length;

//     bedStatusPerWard[wardName] = {
//       occupiedThisWeekBeds: occupiedBedsThisWeek,
//       occupiedThisMonthBeds: occupiedBedsThisMonth,
//       availableBeds: availableBeds,
//     };
//   });

//   const admissionStatistics = {
//     thisWeek: Object.values(bedStatusPerWard).reduce((total, ward) => total + ward.occupiedThisWeekBeds, 0),
//     thisMonth: Object.values(bedStatusPerWard).reduce((total, ward) => total + ward.occupiedThisMonthBeds, 0),
//   };

//   res.json({ bedStatusPerWard, admissionStatistics });
// });

const getBedStatusAndAdmissionStatistics = asyncHandler(async (req, res) => {
  const bedsData = await Bed.findOne(); // Assuming you have only one document with all beds

  if (!bedsData) {
    return res.status(404).json({ message: 'No bed data found.' });
  }

  const thisWeekStart = moment().startOf('isoWeek');
  const thisMonthStart = moment().startOf('month');

  const bedStatusPerWard = {};

  bedsData.wards.forEach((ward) => {
    const wardName = ward.name || ward.wardId; // Use wardId if name is undefined
    let occupiedBedsThisWeek = 0;
    let occupiedBedsThisMonth = 0;

    ward.beds.forEach((bed) => {
      if (bed.status === 'occupied') {
        const occupiedDate = moment(bed.occupiedTimestamp);
        if (occupiedDate.isSameOrAfter(thisWeekStart, 'day')) {
          occupiedBedsThisWeek++;
        }
        if (occupiedDate.isSameOrAfter(thisMonthStart, 'day')) {
          occupiedBedsThisMonth++;
        }
      }
    });

    const availableBeds = ward.beds.filter((bed) => bed.status === 'available').length;

    bedStatusPerWard[wardName] = {
      occupiedThisWeekBeds: occupiedBedsThisWeek,
      occupiedThisMonthBeds: occupiedBedsThisMonth,
      availableBeds: availableBeds,
    };
  });

  const admissionStatistics = {
    thisWeek: Object.values(bedStatusPerWard).reduce((total, ward) => total + ward.occupiedThisWeekBeds, 0),
    thisMonth: Object.values(bedStatusPerWard).reduce((total, ward) => total + ward.occupiedThisMonthBeds, 0),
  };

  res.json({ bedStatusPerWard, admissionStatistics });
});



// // Get admission data for occupied beds
// const getAdmissionDataForOccupiedBeds = asyncHandler(async (req, res) => {
//   const occupiedBeds = await Bed.find({ 'wards.beds.status': 'occupied' });

//   if (!occupiedBeds || occupiedBeds.length === 0) {
//     return res.status(404).json({ message: 'No occupied beds found.' });
//   }

//   const admissionData = [];

//   occupiedBeds.forEach((bed) => {
//     bed.wards.forEach((ward) => {
//       ward.beds.forEach((bed) => {
//         if (bed.status === 'occupied') {
//           const admissionDate = bed.admissionDate;
//           const bedNumber = bed.number;
//           const patientName = bed.patientName;

//           admissionData.push({
//             admissionDate,
//             bedNumber,
//             patientName,
//           });
//         }
//       });
//     });
//   });

//   res.json(admissionData);
// });

module.exports = { getBedStatusAndAdmissionStatistics };
