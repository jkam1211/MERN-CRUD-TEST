/**
 * The route to handle the businesses
 */

const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');
const businessCtrl = require('../../controllers/businessCtrl');

router.post(
  '/create',
  upload.fields([
    { name: 'pictures', maxCount: 10 },
    { name: 'logo', maxCount: 1 }
  ]),
  businessCtrl.create
);
router.post('/getAll', businessCtrl.getAll);
router.put(
  '/updateById/:_id',
  upload.fields([
    { name: 'pictures', maxCount: 10 },
    { name: 'logo', maxCount: 1 }
  ]),
  businessCtrl.updateById
);
router.delete('/deleteById/:_id', businessCtrl.deleteById);
router.get('/insertMockData', businessCtrl.insertMockData);

module.exports = router;
