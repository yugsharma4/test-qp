import jsonwebtoken from "jsonwebtoken";

type TokenPayload = {
  mobile: number;
};

// Generate a new JWT token
export const generateToken = (
  payload: TokenPayload,
  secretKey: string,
  expiresIn: number
) => {
  return jsonwebtoken.sign(payload, secretKey, { expiresIn });
};

// Verify and decode a JWT token
export const verifyToken = async (token: string, secretKey: string) => {
  try {
    return jsonwebtoken.verify(token, secretKey);
  } catch (err) {
    return err;
  }
};
