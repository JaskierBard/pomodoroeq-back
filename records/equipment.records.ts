import { FieldPacket } from "mysql2";
import { pool } from "../utils/db";

type EqRecordResult = [EqRecord[], FieldPacket[]];


export class EqRecord implements EqRecord {
    id: string;
    tomato: number;
    cucumber: number
    pumpkin: number;
    tomatoSeed: number;
    cucumberSeed: number
    pumpkinSeed: number;

    constructor(obj:EqRecord) {
        this.id = obj.id;
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

    }
    

