const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauces');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');


router.get('/', auth, sauceController.getSauce);
router.get('/:id', auth, sauceController.getSauceId);

router.post('/', auth, multer, sauceController.postSauce);
router.post('/:id/like', auth, sauceController.likeSauce);

router.put('/:id', auth, multer, sauceController.putSauce);

router.delete('/:id', auth, sauceController.deleteSauce);
module.exports = router;
