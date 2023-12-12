import express from "express"
import { validateTokenAPI } from "../../utils/JWT";
import Module from "../../models/Module";
import School from "../../models/School";

const router = express.Router()

router.get("/", async (req, res) => {
  let module = await Module.findAll({attributes:{exclude:["createdAt","updatedAt"]}})
  if(!module) return res.json("Module not Found")
  res.json(module)
});

router.get("/:module_name", async (req, res) => {
    let module = await Module.findOne({where:{module_name: req.params.module_name}})
    if(!module) return res.json("Module not Found")
    res.json(module)
});

router.post('/', async (req, res) => {
  let moduleData = req.body

  try {
    await Module.create(moduleData).then(function(){
      res.json("SUCCESS CREATE NEW MODULE")
    })
  } catch (error) {
    res.json(error)
  }  
});


export default router;
