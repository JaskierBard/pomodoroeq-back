import { pool } from "../utils/db";
import {v4 as uuid} from "uuid";
import { FieldPacket } from "mysql2";

type AuthRecordResult = [AuthRecord[], FieldPacket[]];


export class AuthRecord {
    id?: string;
    user_id: string;
    token: string

    constructor(obj: AuthRecord) {
        this.id = obj.id;
        this.user_id = obj.user_id;
        this.token = obj.token
    }


    async insertToken(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }
            await pool.execute("INSERT INTO `tokens`(id, user_id, token) VALUES(:id, :user_id, :token)", {
                id: this.id,
                user_id: this.user_id,
                token: this.token,
            });
        return this.id;
    }

    static async refreshTokens(user_id :string): Promise<AuthRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `token` WHERE ") as AuthRecordResult;
        return results.map(obj => new AuthRecord(obj));
    }
}






