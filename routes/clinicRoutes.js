const express = require('express');
const { saveFormData, getBanners, getClinicData } = require('../controllers/clinicController');
const router = express.Router();

router.post('/saveForm', saveFormData);
router.post('/clinicData', getClinicData);
router.get('/banners', getBanners);

module.exports = router;
