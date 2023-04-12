import {pool} from "../utils/db";
import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";
import { hash } from 'bcrypt';
import { compare } from 'bcrypt';

type UserRecordResult = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserRecord {
    id?: string;
    name: string;
    mail: string
    password: string;

    constructor(obj: UserRecord) {
        this.id = obj.id;
        this.name = obj.name;
        this.mail = obj.mail
        this.password = obj.password;
    };

    async insertUser(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        };
        
        hash(this.password, 10).then(async (hash) => {
        
            await pool.execute("INSERT INTO `user`(id, name, mail, password) VALUES(:id, :name, :mail, :password)", {
                id: this.id,
                name: this.name,
                mail: this.mail,
                password: hash
            });
        });
        return this.id;
    };

    static async listAll(): Promise<UserRecord[]> {
        const [results] = await pool.execute("SELECT * FROM `user`") as UserRecordResult;
        return results.map(obj => new UserRecord(obj));
    };

    static async Login(name: string, password: string): Promise<UserRecord | any | string> {
        try {
            const [results] = await pool.execute("SELECT * FROM `user` WHERE `name` = :name", {
                name,
            }) as UserRecordResult;
    
            const match = await compare(password, results[0].password) 
             
                if (match) {
                    console.log('zwracamy id!' + results[0].name, results[0].id)

                    return  results[0].id;
                } else {
                    return console.log('passwords do not match');
                }
        } catch (error) {
            console.log(error)
        };  
    };
};