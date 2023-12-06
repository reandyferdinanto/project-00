import express from "express"
import { validateTokenAPI } from "../utils/JWT";
import TEMP_DATA from '../utils/TempData';
import Metric from "../models/Metric";
import MetricSchool from "../models/MetricSchool";

const router = express.Router()

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
    const metric = await Metric.findOne({attributes:{exclude:["createdAt","updatedAt","unique_id"]},include:[
      {model:MetricSchool,as:"metric_school",attributes:{exclude:["createdAt","updatedAt","ownerId","unique_id"]}}
    ]})
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

export default router;
