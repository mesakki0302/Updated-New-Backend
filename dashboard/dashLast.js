
const asyncHandler = require('express-async-handler');
const Bed = require('../bed/bedModel');
const Patient = require('../admit/admitModel');
const Discharged = require('../discharge/dischargeModel');
const Transfer = require('../transfer/transferModel');

const logger = require('../utils/logger');
const moment=require('moment')

//dashboard 7
const Dash7 = asyncHandler(async (req, res) => {
    // Find all patients in the database
    const patients = await Patient.find();
  
    // Extract patient data
    const patientData = patients.map((patient) => ({
      patientName: patient.patientName,
     
      
     
      medicalAcuity: patient.medicalAcuity,
      
      
      riskScore: patient.riskScore
    }));
  
  
    // Send back the patient data
    res.status(200).json(patientData);
  });
  
  //Dashboard 8
  const Dash8 = asyncHandler(async (req, res) => {
      // Initialize an array to store bed turnaround time information
      const bedTurnaroundTime = [];
  
      // Find all discharged patients in the database
      const dischargedPatients = await Discharged.find();
  
      // Iterate through each discharged patient
      for (const dischargedPatient of dischargedPatients) {
        // Destructure relevant information from the discharged patient record
        const { wardId, bedNumber, dischargeDate, dischargeTime } = dischargedPatient;
  
        // Find the corresponding admission record for the same bed and date
        const admissionPatient = await Patient.findOne({
          'wardId': wardId,
          'bedNumber': bedNumber,
          'admissionDate': dischargeDate,
          'admissionTime': { $gt: dischargeTime },
        }).sort({ admissionTime: 1 });
  
        // Check if there is a corresponding admission record
        
        // Check if there is a corresponding admission record
        if (admissionPatient) {
          // Calculate turnaround time in minutes between discharge and admission
          const dischargeDateTime = moment(`${dischargeDate} ${dischargeTime}`, 'YYYY-MM-DD hh:mm A');
          const admissionDateTime = moment(`${admissionPatient.admissionDate} ${admissionPatient.admissionTime}`, 'YYYY-MM-DD hh:mm A');
          const turnaroundTime = admissionDateTime.diff(dischargeDateTime, 'minutes');
  
          // Format the date as "YYYY-MM-DD"
          const formattedDate = moment(dischargeDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
  
          // Find the ward name based on wardId
          const bed = await Bed.findOne({ 'wards.wardId': wardId, 'wards.beds.bedNumber': bedNumber });
          const wardName = bed ? bed.wards.find(ward => ward.wardId == wardId).wardName : null;
  
          // Push the bed turnaround time information to the array
          bedTurnaroundTime.push({
            ward: wardName,
            date: formattedDate,
            turnaroundTime: turnaroundTime,
          });
        }
      }
  
      // Send the bed turnaround time information as JSON response
      res.json({ bedTurnaroundTime });
  });
  
  //dashboard 9:
  // Function to calculate infection rate
  async function calculateInfectionRate() {
    try {
      const totalAdmittedPatients = await Patient.countDocuments();
      const infectedPatients = await Patient.countDocuments({ infectionStatus: 'infected' });
      if (totalAdmittedPatients === 0) {
        return 0;
      }
      return (infectedPatients / totalAdmittedPatients) * 100;
    } catch (error) {
      console.error('Failed to calculate infection rate', error);
      throw error;
    }
  }
  
  // const Dash9 = asyncHandler(async (req, res) => {
  //     const { wardId } = req.params;
  
  //     // Find the bed within the ward
  //     const bedData = await Bed.findOne({ 'wards.wardId': wardId });
  
  //     if (!bedData) {
  //       const error = new Error("Ward not found");
  //       logger.error("Ward not found")
  //       throw error
  //     }
  
  //     // Calculate infection rate
  //     const totalAdmittedPatients = await Patient.countDocuments();
  //     const infectedPatients = await Patient.countDocuments({ infectionStatus: 'infected' });
  //     const infectionRate = totalAdmittedPatients === 0 ? 0 : (infectedPatients / totalAdmittedPatients) * 100;
  
  //     // Calculate mortality rate
  //     const totalBedsInWard = bedData.wards.reduce((total, ward) => total + ward.beds.length, 0);
  //     const dischargedRecords = await Discharged.find({ wardId, 'dischargeReasons': 'died' });
  //     const totalDiedCases = dischargedRecords.length;
  //     const mortalityRate = (totalDiedCases / totalBedsInWard) * 100;
  
  //     res.json({ wardId, infectionRate, mortalityRate });
  // });

//  const Dash9 = asyncHandler(async (req, res) => {
//     const { wardId } = req.params;
//   // Find the bed within the ward
//     const bedData = await Bed.findOne({ 'wards.wardId': wardId });

//     if (!bedData) {
//         const error = new Error("Ward not found");
//         logger.error("Ward not found")
//         throw error
//     }

//     // Calculate infection rate for the specific ward
//     const totalBedsInWard = bedData.wards.find(ward => ward.wardId === wardId).beds.length;
//     const infectedPatientsInWard = await Patient.countDocuments({ wardId, infectionStatus: 'infected' });
//     const infectionRate = totalBedsInWard === 0 ? 0 : (infectedPatientsInWard / totalBedsInWard) * 100;

//     // Calculate mortality rate
//     const dischargedRecords = await Discharged.find({ wardId, 'dischargeReasons': 'died' });
//     const totalDiedCases = dischargedRecords.length;
//     const mortalityRate = (totalDiedCases / totalBedsInWard) * 100;

//     res.json({ wardId, infectionRate, mortalityRate });
// });

const Dash9 = asyncHandler(async (req, res) => {
  const { wardId } = req.params; // Extract wardId from URL parameters

  // Find the bed within the ward
  const bedData = await Bed.findOne({ 'wards.wardId': wardId });

  if (!bedData) {
    const error = new Error("Ward not found");
    logger.error("Ward not found");
    throw error;
  }

  // Calculate infection rate for the specific ward
  const totalBedsInWard = bedData.wards.find(ward => ward.wardId === wardId).beds.length;
  const infectedPatientsInWard = await Patient.countDocuments({ wardId, infectionStatus: 'infected' });
  const infectionRate = totalBedsInWard === 0 ? 0 : (infectedPatientsInWard / totalBedsInWard) * 100;

  // Calculate mortality rate
  const dischargedRecords = await Discharged.find({ wardId, 'dischargeReasons': 'died' });
  const totalDiedCases = dischargedRecords.length;
  const mortalityRate = (totalDiedCases / totalBedsInWard) * 100;

  // Get the month and year when infection rate occurred
  const infectionDate = new Date(); // You should replace this with the actual date from your data
  const infectionMonth = infectionDate.toLocaleString('en-us', { month: 'long', year: 'numeric' });

  // Get the month and year when mortality rate occurred
  const mortalityDate = new Date(); // You should replace this with the actual date from your data
  const mortalityMonth = mortalityDate.toLocaleString('en-us', { month: 'long', year: 'numeric' });

  res.json({ wardId, timeInterval: infectionMonth, mortalityRate, infectionRate });
});


//dashboard 10:
//   const Dash10 = asyncHandler(async (req, res) => {
//     const patientFlow = [];
  
//     // Find all transfer records
//     const transferRecords = await Transfer.find();
  
//     // Create a map to store patient flow counts
//     const patientFlowMap = {};

// for (const transfer of transferRecords) {
//   const { currentWardId, transferWardId } = transfer;

//   // Create flow keys for both directions
//   const flowKey1 = `${currentWardId} to ${transferWardId}`;
//   const flowKey2 = `${transferWardId} to ${currentWardId}`;

//   // Increment counts for both flow directions
//   patientFlowMap[flowKey1] = (patientFlowMap[flowKey1] || 0) + 1;
//   patientFlowMap[flowKey2] = (patientFlowMap[flowKey2] || 0) + 1;
// }
//     //console.log(patientFlowMap); //Ex{'Ward A1 to Ward B1': 1}
  
//     // Convert the map to the desired output format
//     for (const key in patientFlowMap) {
//       const [from, to] = key.split(' to ');
//       const value = patientFlowMap[key];
  
//       patientFlow.push({ from, to, value });
//     }
  
//     res.json({ patientFlow });
//   }) 


const Dash10 = asyncHandler(async (req, res) => {
  const patientFlow = [];

  // Find all transfer records
  const transferRecords = await Transfer.find();

  // Create a map to store patient flow counts
  const patientFlowMap = {};

  // Iterate through transfer records and count the flows from currentdept to transferdept
  for (const transfer of transferRecords) {
    const { currentWardId, transferWardId } = transfer;
    console.log(`currentWardId: ${currentWardId}, transferWardId: ${transferWardId}`);

    // Create unique keys for each patient flow in both directions
    const flowKeyAB = `${currentWardId} to ${transferWardId}`;
    const flowKeyBA = `${transferWardId} to ${currentWardId}`;

    // Increment the count for the flow in the map for both directions
    patientFlowMap[flowKeyAB] = (patientFlowMap[flowKeyAB] || 0) + 1;
    patientFlowMap[flowKeyBA] = (patientFlowMap[flowKeyBA] || 0) + 1;
  }

  // Convert the map to the desired output format
  for (const key in patientFlowMap) {
    const [from, to] = key.split(' to ');
    const value = patientFlowMap[key];

    patientFlow.push({ from, to, value });
  }

  res.json({ patientFlow });
});

  
  
  //dashboard 11:
  const Dash11 = asyncHandler(async (req, res) => {
    // Calculate readmission rate
    const readmissionRateData = await Patient.aggregate([
      {
        $group: {
          _id: '$contactno',
          totalAdmissions: { $sum: 1 },
          totalReadmissions: { $sum: { $cond: [{ $ne: ['$admissionDate', '$dischargeDate'] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          readmissionRate: { $cond: [{ $eq: ['$totalAdmissions', 0] }, 0, { $divide: ['$totalReadmissions', '$totalAdmissions'] }] }
        }
      }
    ]);
  
    // Calculate the total readmission rate
    const totalReadmissionRate = readmissionRateData.reduce((total, record) => {
      return total + record.readmissionRate;
    }, 0);
  
    // Calculate infection rate
    const totalAdmittedPatients = await Patient.countDocuments();
    const infectedPatients = await Patient.countDocuments({ infectionStatus: 'infected' });
    const infectionRate = (totalAdmittedPatients === 0) ? 0 : (infectedPatients / totalAdmittedPatients) * 100;
  
    // Calculate avgLengthOfStay
    const patients = await Patient.find();
    const avgLengthOfStay = patients.reduce((total, patient) => {
      if (patient.admissionDate && patient.dischargeDate) {
        const admissionDate = new Date(patient.admissionDate);
        const dischargeDate = new Date(patient.dischargeDate);
        const lengthOfStay = (dischargeDate - admissionDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
        return total + lengthOfStay;
      }
      return total;
    }, 0) / patients.length;
  
    // Get the date from the first patient in the collection
    const firstPatient = patients[0];
    const date = firstPatient ? firstPatient.admissionDate : null;
  
    // Create the desired output object
    const output = {
      patientOutcomeMetrics: [
        {
          date: date,
          mortalityRate: 0.03, // Example value, you can calculate this based on your data
          readmissionRate: totalReadmissionRate,
          avgLengthOfStay: avgLengthOfStay
        }
      ]
    };
  
    res.json(output);
  });
  
  //Dashboard 12:
  
  const Dash12 = asyncHandler(async (req, res) => {
    const patients = await Patient.find(); // Retrieve all patients
  
    const patientCounts = {};
  
    patients.forEach((patient) => {
      // Check if the patient has wards, admissionTime, and admissionDate
      if (patient.wardName && patient.admissionTime && patient.admissionDate) {
        const key = `${patient.wardName}-${patient.admissionDate}-${patient.admissionTime}`;
        patientCounts[key] = (patientCounts[key] || 0) + 1;
      }
    });
  
    // Transform the patientCounts object into an array of objects
    const formattedCounts = Object.keys(patientCounts).map((key) => {
      const dateParts = key.split('-');
      const admissionDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[3]}`;
      const admissionTime = dateParts[4]; // Assuming admissionTime is already in the desired format
      return {
        wardName: dateParts[0],
        admissionDate: admissionDate,
        admissionTime: admissionTime,
        patientCount: patientCounts[key],
      };
    });
  
    res.status(200).json({ patientCounts: formattedCounts });
  });
  
  module.exports = {Dash7,Dash8,Dash9,Dash10,Dash11,Dash12}
  