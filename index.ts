import express from "express";
import cors from 'cors';
import jwt from "jsonwebtoken";
import { UserRecord } from "./records/user.records";
import { AuthRecord } from "./records/auth.token";
import { authMiddleware } from "./middleware/authMiddleware";
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
    expiresIn: "5m",
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



// app.delete("/api/users/:userId", verify, (req, res) => {
//   if (req.user.id === req.params.userId || req.user.isAdmin) {
//     res.status(200).json("User has been deleted.");
//   } else {
//     res.status(403).json("You are not allowed to delete this user!");
//   }
// });

app.delete("/api/logout",async (req, res) => {
  const userId = req.body.id;
  await AuthRecord.clearTokens(userId)
  // const refreshToken = req.body.token;
  // refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.status(200).json("You logged out successfully.");
});

// app.post("/api/logout", authMiddleware, (req, res) => {
//   console.log('"You almost logged out."')

//   const refreshToken = req.body.token;
//   refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
//   console.log('"You logged out successfully."')
//   res.status(200).json("You logged out successfully.");
// });

app.get("/api/admin", authMiddleware, (req, res) => {
  console.log('dostęp!')
  res.send('hejjj')
});

app.post('/createUser', async (req, res) => {
  const newUser = new UserRecord(req.body);

  console.log(req.body + 'body')
  await newUser.insertUser();

  res.json(newUser);
})

app.listen(3001, () => console.log("Backend server is running!"));


