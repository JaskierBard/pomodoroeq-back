import {Router} from "express";
import { EqRecord } from "../records/equipment.records";
import { CustomersRecords } from "../records/customers.records";
import { AuthRecord } from "../records/auth.token";
import jwt from "jsonwebtoken";
import { UserRecord } from "../records/user.records";

const generateAccessToken = async(user:any) => {
    return jwt.sign({ id: user}, "mySecretKey", {
     expiresIn: "15s",
   });
 
 };
 
 const generateRefreshToken = async(user:any) => {
   const token = jwt.sign({ id: user.id}, "myRefreshSecretKey");
   const obj = {
     user_id: user,
     token: token,
   };
 
   const newDataToken = new AuthRecord(obj as any);
   await newDataToken.insertToken();
   
   return token
 
 
 }


export const userRecord = Router();

userRecord 

.post("/refresh", async(req, res) => {
    const refreshToken = req.body.token;
    const userId = req.body.userId;
  
    let refreshTokens:any[] = await AuthRecord.refreshTokens(userId)
    console.log('refreshTokens' + refreshTokens)
  
    if (!refreshToken) return res.status(401).json("You are not authenticated!");
  
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid!");
    }
  
    jwt.verify(refreshToken, "myRefreshSecretKey", (err:any, user: any) => {
      err && console.log(err);
      refreshTokens = refreshTokens.filter((token:string) => token !== refreshToken);
  
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
  
      // refreshTokens.push(newRefreshToken);
  
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  
    //if everything is ok, create new access token, refresh token and send to user
  })
  

  
  .post("/login",async (req, res) => {
    const { username, password } = req.body;
    const user = await UserRecord.Login(username, password)
  
    if (user) {
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);
      // refreshTokens.push(refreshToken);
      res.json({
        userId: user,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).json("Username or password incorrect!");
    }
  })
  
  
  
  
  
  .delete("/logout",async (req, res) => {
    console.log('otrzymałem info')
    const userId = req.body.id;
    await AuthRecord.clearTokens(userId)
    res.status(200).json("You logged out successfully.");
  })
  
  
  
  
  .post('/createUser', async (req, res) => {
    const newUser = new UserRecord(req.body);
  
    console.log(newUser)
    await newUser.insertUser();
  
    res.json(newUser);
  })