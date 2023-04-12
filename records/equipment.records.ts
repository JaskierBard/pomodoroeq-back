import { FieldPacket } from "mysql2";
import { pool } from "../utils/db";
import { EquipmentInterface } from "../types/equipment/equipment.entity";

type EqRecordResult = [EqRecord[], FieldPacket[]];

export class EqRecord implements EquipmentInterface {
    id: string;
    money: number;
    tomato: number;
    cucumber: number;
    pumpkin: number;
    tomatoSeed: number;
    cucumberSeed: number;
    pumpkinSeed: number;

    constructor(obj:EquipmentInterface) {
        this.id = obj.id;
        this.money = obj.money;
        this.tomato = obj.tomato;
        this.cucumber = obj.cucumber
        this.pumpkin = obj.pumpkin;
        this.tomatoSeed = obj.tomatoSeed;
        this.cucumberSeed = obj.cucumberSeed
        this.pumpkinSeed = obj.pumpkinSeed;
    };
   
    static async getEq(id:string): Promise<EqRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `user` WHERE `id` = :id", {
            id,
        }) as EqRecordResult;

        return results.map(obj => new EqRecord(obj));
    };

    async updateSeeds(tomatoSeed: number =0, cucumberSeed: number=0, pumpkinSeed: number=0, value: number, id:string ): Promise<void> {
        await pool.execute("UPDATE `user` SET `money` = money - :value, `tomatoSeed` = tomatoSeed + :tomatoSeed, `cucumberSeed` = cucumberSeed + :cucumberSeed, `pumpkinSeed` = pumpkinSeed + :pumpkinSeed WHERE `id` = :id", {
            id, value, pumpkinSeed, cucumberSeed, tomatoSeed,
            
        });
    };
  
    async updateWegetables(needs:string,quantity:number, userId:string ): Promise<void> {
        this.tomato = 0
        this.cucumber = 0, 
        this.pumpkin = 0
        let value = 0
        if (needs === 'tomato') {
            this.tomato = quantity
            value = quantity * 3
        };
        if (needs === 'cucumber') {
            this.cucumber = quantity
            value = quantity * 6
        };
        if (needs === 'pumpkin') {
            this.pumpkin = quantity
            value = quantity * 14
        };
        await pool.execute("UPDATE `user` SET `money` = money + :value, `tomato` = tomato - :tomato, `cucumber` = cucumber - :cucumber, `pumpkin` = pumpkin - :pumpkin WHERE `id` = :userId", {
            userId,
            value: value,
            tomato:this.tomato,
            cucumber:this.cucumber,
            pumpkin:this.pumpkin,
        });
    };

    async getReward(needs:string, userId:string ): Promise<void> {
        this.tomato = 0
        this.cucumber = 0, 
        this.pumpkin = 0
        this.tomatoSeed = 0
        this.cucumberSeed = 0, 
        this.pumpkinSeed = 0

        if (needs === 'tomato') {
            this.tomato = 3
            this.tomatoSeed = 1
        };
        if (needs === 'cucumber') {
            this.cucumber = 3
            this.cucumberSeed = 1
        };
        if (needs === 'pumpkin') {
            this.pumpkin = 3
            this.pumpkinSeed = 1
        };

        await pool.execute("UPDATE `user` SET `tomato` = tomato + :tomato, `cucumber` = cucumber + :cucumber, `pumpkin` = pumpkin + :pumpkin WHERE `id` = :userId", {
            userId,
            tomato:this.tomato,
            cucumber:this.cucumber,
            pumpkin:this.pumpkin,
        });
        await pool.execute("UPDATE `user` SET `tomatoSeed` = tomatoSeed - :tomatoSeed, `cucumberSeed` = cucumberSeed - :cucumberSeed, `pumpkinSeed` = pumpkinSeed - :pumpkinSeed WHERE `id` = :userId", {
            userId,
            tomatoSeed:this.tomatoSeed,
            cucumberSeed:this.cucumberSeed,
            pumpkinSeed:this.pumpkinSeed,
        });
    };

    async removeClient(id: string): Promise<void> {
        await pool.execute("DELETE FROM `customers` WHERE `id` = :id", {
            id,
        });   
    };
};
    

