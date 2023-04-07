import {Router} from "express";
import { EqRecord } from "../records/equipment.records";
import { CustomersRecords } from "../records/customers.records";

export const equipmentRouter = Router();

equipmentRouter 

.patch("/", async(req, res) => {
    const userId = req.body.userId;  
    const eq = await EqRecord.getEq(userId)
    console.log(eq)
    res.json(eq);
  })
  
.post("/", async(req, res) => {
    const { tomatoSeed, cucumberSeed, pumpkinSeed, value, userId } = req.body;
    const eq:any = await EqRecord.getEq(userId)
    if (value<eq[0].money) {
      await eq[0].updateSeeds(tomatoSeed, cucumberSeed, pumpkinSeed, value, userId)
      res.json(eq[0]);
  
    }else {
      console.log('masz za mało pieniędzy!')
      res.json('masz za mało pieniędzy!')
    }
  });