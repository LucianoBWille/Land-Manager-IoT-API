var express = require('express');
const Device = require('../models/Device');
var router = express.Router();

router.get('/', async function (req, res, next) {
  res.json(await Device.find({ userId: req.userId }));
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const device = await Device.find({ _id: id, userId: userId });

  return device
    ? res.json(device)
    : res.sendStatus(404);
})

router.post('/', async (req, res) => {
  const json = req.body;
  const userId = req.userId;
  json.userId = userId;

  if (!userId) return res.status(400).send({ message: 'userId is required' });

  if ((await Device.countDocuments({ userId: userId, name: json.name })) > 0) {
    return res.status(400).send({ message: 'Device already exists' });
  } else {
    const device = new Device(json);
    const hasErrors = device.validateSync();
    return hasErrors ? res.status(400).send({ message: hasErrors }) : res.json(await device.save());
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const json = req.body;

  const device = await Device.findById(id);

  if (!device) return res.sendStatus(404);

  if (json.userId !== device.userId) return res.sendStatus(400).body({ message: 'userId is not valid' });

  json.createdAt = device.createdAt;
  json.updatedAt = new Date();

  const hasErrors = new Device(json).validateSync();
  if (hasErrors) return res.sendStatus(400).body({ message: hasErrors });

  await Device.updateOne({ _id: id }, json);
  res.json(json)

})

//delete device
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const result = await Device.deleteOne({ _id: id, userId });

  if (result.deletedCount > 0) {
    res.send('Device deleted');
  } else {
    res.sendStatus(404);
  }

})

module.exports = router;
