import { FieldPacket } from "mysql2";
import { pool } from "../utils/db";

type EqRecordResult = [EqRecord[], FieldPacket[]];


export class EqRecord implements EqRecord {
    id: string;
    money: number;
    tomato: number;
    cucumber: number
    pumpkin: number;
    tomatoSeed: number;
    cucumberSeed: number
    pumpkinSeed: number;

    constructor(obj:EqRecord) {
        this.id = obj.id;
        this.money = obj.money;
        this.tomato = obj.tomato;
        this.cucumber = obj.cucumber
        this.pumpkin = obj.pumpkin;
        this.tomatoSeed = obj.tomatoSeed;
        this.cucumberSeed = obj.cucumberSeed
        this.pumpkinSeed = obj.pumpkinSeed;
    }

    static async getEq(id:string): Promise<EqRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `user` WHERE `id` = :id", {
            id,
        }) as EqRecordResult;

        return results.map(obj => new EqRecord(obj));
    }

    async updateSeeds(tomatoSeed: number, cucumberSeed: number, pumpkinSeed: number, value: number, id:string ): Promise<void> {
        await pool.execute("UPDATE `user` SET `money` = money - :value, `tomatoSeed` = tomatoSeed + :tomatoSeed, `cucumberSeed` = cucumberSeed + :cucumberSeed, `pumpkinSeed` = pumpkinSeed + :pumpkinSeed WHERE `id` = :id", {
            id, value, pumpkinSeed, cucumberSeed, tomatoSeed,
            
        });
    }

    async updateWegetables(needs:string,quantity:number, userId:string ): Promise<void> {
        this.tomato = 0
        this.cucumber = 0, 
        this.pumpkin = 0
        let value = 0
        if (needs === 'tomato') {
            this.tomato = quantity
            value = quantity * 3
        }
        if (needs === 'cucumber') {
            this.cucumber = quantity
            value = quantity * 6

        }
        if (needs === 'pumpkin') {
            this.pumpkin = quantity
            value = quantity * 14

        }
        await pool.execute("UPDATE `user` SET `money` = money + :value, `tomato` = tomato - :tomato, `cucumber` = cucumber - :cucumber, `pumpkin` = pumpkin - :pumpkin WHERE `id` = :userId", {
            userId,
            value: value,
            tomato:this.tomato,
            cucumber:this.cucumber,
            pumpkin:this.pumpkin,
            
        });
    }

    async removeClient(id: string): Promise<void> {
        await pool.execute("DELETE FROM `customers` WHERE `id` = :id", {
            id,
        });   
    }

    }
    

