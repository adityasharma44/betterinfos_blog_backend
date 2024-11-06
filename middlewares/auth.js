import JwtService from "../service/JwtService.js";

const authorization = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(404).json({ message: "Token is not found" });
  }
  
  try {
    const token = authHeader.split(" ")[1];
    const { _id } = await JwtService.verify(token);
    const user = {
      _id,
    };
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Error occur ${error.message}`,
    });
  }
};

export default authorization;
