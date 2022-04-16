const router = require('express').Router();

const userRouter = require('./userRoutes');
const adminRouter = require('./adminRoutes');
const driverRouter = require('./driverRoutes');


router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/driver', driverRouter);

module.exports = router;