import jwt from "jsonwebtoken";

class JwtService {
  static sign(payload, secret = process.env.JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: "30d" });
  }

  static verify(token, secret = process.env.JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}

export default JwtService;
