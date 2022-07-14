const express = require('express');
const UserController = require('../controllers/UserController');
const fileUpload = require('../utils/fileUpload');
const router = express.Router();

router.post('/create-user', fileUpload("./storage/images"), UserController.createUser);
router.get('/all-user', UserController.allUser);
router.get('/single-user/:id', UserController.singleUser);
router.post('/update-user/:id', fileUpload("./storage/images"), UserController.updateUser);
router.delete('/delete-user/:id',  UserController.deleteUser);


module.exports = router;