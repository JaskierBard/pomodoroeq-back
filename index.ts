import express from "express";
import cors from 'cors';
import jwt from "jsonwebtoken";
import { UserRecord } from "./records/user.records";
import { AuthRecord } from "./records/auth.token";
import { authMiddleware } from "./middleware/authMiddleware";
import { EqRecord } from "./records/equipment.records";
const app = express();

app.use(express.json()) ;
app.use(cors({
  origin: 'http://localhost:3000',
}));

// let refreshTokens:string[] = [];

app.post("/api/refresh", async(req, res) => {
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
});

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


};

app.post("/api/login",async (req, res) => {
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
});





app.delete("/api/logout",async (req, res) => {
  console.log('otrzymałem info')
  const userId = req.body.id;
  await AuthRecord.clearTokens(userId)
  res.status(200).json("You logged out successfully.");
});

app.patch("/api/equipment", async(req, res) => {
  const userId = req.body.userId;
  // console.log(req.body.userId)

  const eq = await EqRecord.getEq(userId)
  console.log(eq)
  res.json(eq);
});

app.post("/api/equipment", async(req, res) => {
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


app.post('/createUser', async (req, res) => {
  const newUser = new UserRecord(req.body);

  console.log(req.body + 'body')
  await newUser.insertUser();

  res.json(newUser);
})

app.listen(3001, () => console.log("Backend server is running!"));


