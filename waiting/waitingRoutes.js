
const express = require('express');
const router = express.Router();
const {addWaitingEntry,PriorityUpdate,BedAssignUpdate,WaitGet,deleteWaitingPatient}=require('../waiting/waitingController')


//waiting:
router.post('/waitingentry1',addWaitingEntry)
//Priority
router.put('/pro',PriorityUpdate)

//Bedassign
router.put('/assignbedss',BedAssignUpdate)

//WaitGet
router.get('/Waiting',WaitGet)

//delete
router.delete('/deletewait/:patientId', deleteWaitingPatient);

module.exports = router;