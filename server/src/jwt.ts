import { sign, verify } from 'jsonwebtoken';

interface TokenPayload {
  exp: number;
  uuid: string;
  iat: number;
}

/**
 * generates JWT used for local testing
 * @param data payload
 */
export function generateToken(data: any) {
  // information to be encoded in the JWT
  const payload = data;

  // generate JWT
  return sign({ uuid: payload }, 'secret1234', {
    expiresIn: 3600 * 24 * 360, //1year
  });
}

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
export function validateToken(token: string): Promise<TokenPayload> {
  return new Promise((resolve, reject) => {
    if (token) {
      if (token.toLowerCase().startsWith('bearer')) {
        token = token.slice('bearer'.length).trim();
      }
      const decode: any = verify(token, 'secret1234');
      resolve(decode);
    }
    return;
  });
}
