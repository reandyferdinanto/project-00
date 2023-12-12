import express from "express"
import { validateTokenAPI } from "../../utils/JWT";
import Module from "../../models/Module";
import School from "../../models/School";

const router = express.Router()

router.get("/", async (req, res) => {
  let school = await School.findAll({
    attributes:{exclude:["createdAt", "updatedAt"]},
    include:[
      {model: Module, as: "modules", attributes:{exclude:["createdAt", "updatedAt"]}, through:{as:"status",attributes:["subscribed"]}}
    ]
  })
  if(!school) return res.json("school not Found")
  res.json(school)
});

router.get("/:id", async (req, res) => {
  let schoolId = req.params.id
  let school = await School.findByPk(schoolId,{
    attributes:{exclude:["createdAt", "updatedAt"]},
    include:[
      {model: Module, as: "modules", attributes:{exclude:["createdAt", "updatedAt"]}, through:{as:"status",attributes:["subscribed"]}}
    ]
  })
  if(!school) return res.json("school not Found")
  res.json(school)
});

router.post('/', async (req, res) => {
  let schoolData = req.body
  try {
    let school = await School.create(schoolData)
    res.json(school)
  } catch (error) {
    res.json(error)
  }  
});

router.put("/:id", async(req,res) => {
  let schoolId = req.params.id
  let school = await School.findByPk(schoolId)
  let moduleId = req.body.moduleId || ""
  let schoolData = req.body
  try {
    if(school){
      school.update(schoolData)
      let module = await Module.findByPk(moduleId)
      if(module){
        school.setModules([module])
        return res.json("Success add new module to school")
      }
      res.json("Success update school data")
    }else{
      res.json("School not found")
    }
  } catch (error) {
    res.json(error)
  }
})


export default router;
