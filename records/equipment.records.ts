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
        console.log(id)
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

    }
    

