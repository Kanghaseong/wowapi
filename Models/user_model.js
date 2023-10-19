import mongoose from "mongoose";

const user_schema = new mongoose.Schema({
  gender: { type: String, required: true },
  race: { type: String, required: true },
  name: { type: String, required: true },
  faction: { type: String, required: true },
  character_class: { type: String, required: true },
  realm: { type: String, required: true },
  guild: String,
  level: { type: Number, required: true },
  experience: { type: Number, required: true },
  last_login_timestamp: { type: Number, required: true },
  is_ghost: { type: Boolean, required: true },

  // 캐릭터가 완전히 죽었는지 여부
  is_fully_dead: { type: Boolean, default: false },

  //데이터 저장당시 시간 저장 필드
  createdAtCustom: {
    type: String,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    },
  },
});

const User = mongoose.model("User", user_schema);

export default User;
