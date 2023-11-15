const router = require("express").Router();
const { validateTokenAPI } = require("../utils/JWT");
const TEMP_DATA = require('../utils/TempData')
const { Metric } = require("../models");

router.get("/", (req, res) => {
  res.json({
    postman_docs: "https://documenter.getpostman.com/view/17399437/2s93eYTrCu",
  });
});

router.post('/temp-form-data', validateTokenAPI, (req, res) => {
  const formData = req.body;
  addOrUpdateObject(TEMP_DATA, formData)
  res.status(200).json({ message: 'Data formulir disimpan sementara.' });
});
router.get('/temp-form-data', (req, res) => {
  res.status(200).json({ message: 'Data formulir disimpan sementara.', TEMP_DATA });
});



router.get("/metrics", async function(req, res){
  try {
    const metric = await Metric.findOne({attributes:{exclude:["createdAt",'updatedAt', "id"]}})
    if (!metric) return res.status(200).json("Metrics Empty")
    return res.status(200).json(metric)
  } catch (error) {
    return res.status(500).json({error})
  }
})



function addOrUpdateObject(array, object) {
  const index = array.findIndex((item) => item.id === object.id);

  if (index === -1) {
    array.push(object);
  } else {
    array[index] = object;
  }
}

module.exports = router;
