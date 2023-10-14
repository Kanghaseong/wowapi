import Token from "./Models/TokenModel.js"; // Token 모델을 임포트합니다.

export default async function saveToken(req, res, next) {
  try {
    const { access_koken } = req.token;
    // 이미 해당 토큰이 데이터베이스에 있는지 확인
    const existingToken = await Token.findOne({ access_koken });

    if (!existingToken) {
      // 토큰이 없다면 새로 저장
      const newToken = new Token(req.token);
      await newToken.save();
    }

    next(); // 다음 미들웨어나 라우터 핸들러로 이동
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).send("Internal Server Error");
  }
}
