import jwt from 'jsonwebtoken';
import ConfigService from './../config/config.service';

class JWTService {
  constructor() {
    this.configService = ConfigService;
  }

  generateToken(payload) {
    return jwt.sign(payload, this.configService.get('crypto.jwt.secret'), {
      expiresIn: '24h',
    });
  }

  jwtVerify(token) {
    return jwt.verify(token, this.configService.get('crypto.jwt.secret'));
  }
}

export default new JWTService();
