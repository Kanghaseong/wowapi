// TokenModel.js
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  access_token: {
    type: String,
    required: true,
  },
  expires_in: {
    type: Number,
    required: true,
  },
  token_type: {
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
