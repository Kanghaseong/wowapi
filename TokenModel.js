// TokenModel.js
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    required: true,
  },
  tokenType: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    required: true,
  },
  createdAtCustom: { // 추가된 필드
    type: String,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    }
  }
});

const Token = mongoose.model("Token", TokenSchema);

export default Token;
