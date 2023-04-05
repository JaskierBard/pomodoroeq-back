import { FieldPacket } from "mysql2";
import { pool } from "../utils/db";
import {v4} from "uuid";


type CustomersRecordsResults = [CustomersRecords[], FieldPacket[]];


export class CustomersRecords implements CustomersRecords {
    id?: string;
    name: string;
    quantity: number;
    needs: string;
    picture: string;
    needPicture: string;
    user_id: string

    constructor(obj:CustomersRecords) {
        this.id = obj.id;
        this.name = obj.name;
        this.quantity = obj.quantity;
        this.needs = obj.needs;
        this.picture = obj.picture;
        this.needPicture = obj.needPicture;
        this.user_id = obj.user_id
        
    }

    async insert(): Promise<string> {

        if (!this.id) {
            this.id = v4();
        }
        if (!this.needPicture) {
            this.needPicture = `./assets/images/${this.needs}.png`
        }
        this.needPicture = `./assets/images/${this.needs}.png`

        if ((this.name.charAt(this.name.length - 1)) === 'a') {
            this.picture=  "./assets/images/customer2.png"
        } else {
            this.picture=  "./assets/images/customer1.png"
        }

            await pool.execute("INSERT INTO `customers`(id, user_id, name, quantity, needs, picture, needPicture) VALUES(:id, :user_id, :name, :quantity, :needs, :picture, :needPicture)", {
                id: this.id,
                user_id: this.user_id,
                name: this.name,
                quantity: this.quantity,
                needs: this.needs,
                picture: this.picture,
                needPicture: this.needPicture,


            });
        return this.id;
    }


    static async getCustomers(user_id:string): Promise<CustomersRecords[]> {
        console.log(user_id)
        const [results] = await pool.execute("SELECT * FROM `customers` WHERE `user_id` = :user_id", {
            user_id,
        }) as CustomersRecordsResults;

        return results.map(obj => new CustomersRecords(obj));
    }

   

    }

function uuid(): string {
    throw new Error("Function not implemented.");
}
    