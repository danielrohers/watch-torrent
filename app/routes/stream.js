'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/stream');

router
    .route('/')
    .get(controller.index)
    .post(controller.find)

module.exports = router;
