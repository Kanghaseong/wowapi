import User from "./Models/user_model.js";

export default async function get_users(req, res, next) {
  try {
    const users = await User.find({});
    console.log(users);
    req.users = users;
    next();
  } catch (error) {
    console.error("데이터를 불러오는 데 실패했습니다:");
    next(error);
  }
}
