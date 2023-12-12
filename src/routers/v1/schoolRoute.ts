import express from "express"
import { validateTokenAPI } from "../../utils/JWT";
import Module from "../../models/Module";
import School from "../../models/School";
import SchoolModule from "../../models/SchoolModule";

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
    let module = await Module.findAll()
    let school = await School.create(schoolData)
    school.setModules(module)

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
      let modules = await school.getModules({where:{unique_id: moduleId}})
      school.update(schoolData)
      
      if(modules.length !== 0){
        modules.forEach(async module => {
          let schoolmodule = await SchoolModule.findOne({where:{ModuleUniqueId: module.unique_id, ownerId:schoolId}})
          schoolmodule.update({subscribed: true})
        })
        return res.send("GG")
      }

      return res.send(school)
    }else{
      res.json("School not found")
    }
  } catch (error) {
    res.json(error)
  }
})


export default router;
