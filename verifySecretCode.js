import dotenv from "dotenv";
dotenv.config();

export default async function verifySecretCode(req, res, next) {
  const { secretCode } = req.body;
  if (secretCode === process.env.SECRET_CODE) {
    next();
  } else {
    res.status(401).json({ msg: "Unauthorized: Invalid secret code" });
  }
}
