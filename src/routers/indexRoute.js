const router = require("express").Router();
const TEMP_DATA = require('../utils/TempData')

router.get("/", (req, res) => {
  res.json({
    postman_docs: "https://documenter.getpostman.com/view/17399437/2s93eYTrCu",
  });
});
router.post('/temp-form-data', (req, res) => {
  const formData = req.body;
  addOrUpdateObject(TEMP_DATA, formData)
  console.log(TEMP_DATA);
  res.status(200).json({ message: 'Data formulir disimpan sementara.' });
});
router.get('/temp-form-data', (req, res) => {
  res.status(200).json({ message: 'Data formulir disimpan sementara.', TEMP_DATA });
});

function addOrUpdateObject(array, object) {
  const index = array.findIndex((item) => item.id === object.id);

  if (index === -1) {
    array.push(object);
  } else {
    array[index] = object;
  }
}

module.exports = router;
