import mongoose from 'mongoose';

const { Schema } = mongoose;

const CharacterSchema = new Schema({
  gender: { type: String, required: true },
  race: { type: String, required: true },
  name: { type: String, required: true },
  faction: { type: String, required: true },
  characterClass: { type: String, required: true },
  realm: { type: String, required: true },
  guild: String,  // guild 정보가 없을 수 있으므로 required는 false
  level: { type: Number, required: true },
  experience: { type: Number, required: true },
  last_login_timestamp: { type: Number, required: true },
  is_ghost: { type: Boolean, required: true }
});

const Character = mongoose.model('Character', CharacterSchema);

export default Character;
