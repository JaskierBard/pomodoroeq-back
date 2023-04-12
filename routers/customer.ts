import {Router} from "express";
import { EqRecord } from "../records/equipment.records";
import { CustomersRecords } from "../records/customers.records";

export const customerRouter = Router();

customerRouter 

 .post('/', async (req, res) => {
    const newCustomer = new CustomersRecords(req.body);
    await newCustomer.insert();
    res.json(newCustomer);
  })
  
  .patch("/", async(req, res) => {
    const userId = req.body.userId;
    const customers = await CustomersRecords.getCustomers(userId)
    res.json(customers);
  })

  .delete("/",async (req, res) => {
    const { id, name, quantity, needs,  userId } = req.body;
    const eq:any = await EqRecord.getEq(userId)
  
    if (needs === 'tomato') {
      if (quantity<eq[0].tomato) {
        await eq[0].updateWegetables(needs, quantity, userId)
        await eq[0].removeClient(id)
        res.json(`${name} zapłacił/a za warzywa`)
  
      } else {
        res.json('masz za mało pomidorów')
      };
    };
  
    if (needs === 'cucumber') {
      if (quantity<eq[0].cucumber) {
        await eq[0].updateWegetables(needs, quantity, userId)
        await eq[0].removeClient(id)
        res.json(`${name} zapłacił/a za warzywa`)
  
      } else {
        res.json('masz za mało ogórków')
      };
    };
  
    if (needs === 'pumpkin') {
      if (quantity<eq[0].pumpkin) {
        await eq[0].updateWegetables(needs, quantity, userId)
        await eq[0].removeClient(id)
        res.json(`${name} zapłacił/a za warzywa`)
      } else {
        res.json('masz za mało dyń')
      };
    };
  }
);