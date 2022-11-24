var express = require('express');
const Device = require('../models/Device');
const Measurement = require('../models/Measurement');
var router = express.Router();

router.get('/all/:deviceId', async function (req, res, next) {
  const { deviceId } = req.params;
  res.json(await Measurement.find({ deviceId: deviceId }));
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const measurement = await Measurement.findById(id);
  if (!measurement) return res.sendStatus(404);

  const device = await Device.findById(measurement.deviceId);
  if (device.userId !== userId) return res.status(401).send({ message: 'Unauthorized' });

  return res.json(measurement)
})

router.post('/', async (req, res) => {
  const json = req.body;
  const userId = req.userId;

  if (!json.deviceId) return res.status(400).send({ message: 'deviceId is required' });

  const device = await Device.findById(json.deviceId);
  if (!device) return res.status(400).send({ message: 'deviceId is not valid' });
  if (device.userId !== userId) return res.status(401).send({ message: 'Unauthorized' });

  const measurement = new Measurement(json);
  measurement.createdAt = new Date();
  const hasErrors = measurement.validateSync();

  if (hasErrors) return res.status(400).send({ message: hasErrors });
  return res.json(await measurement.save());
})

//delete device
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const measurement = await Measurement.findById(id);
  if (!measurement) return res.sendStatus(404);

  const device = await Device.findById(measurement.deviceId);
  if (device.userId !== userId) return res.status(401).send({ message: 'Unauthorized' });

  const result = await Measurement.deleteOne({ _id: id });

  if (result.deletedCount > 0) {
    res.send('Measurement deleted');
  } else {
    res.sendStatus(404);
  }

})

module.exports = router;
