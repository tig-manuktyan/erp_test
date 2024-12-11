import bcrypt from 'bcrypt';
import response from '../../../lib/shared/src/http/response.js';
import ApiError from '../../../lib/shared/src/error/ApiError.js';
import UserService from './../user/user.service.js';
import TokenService from '../token/token.service.js';
import l10n from '../../../lib/shared/src/config/l10n-constants.js';

class AuthService {
  constructor() {
    this.userService = UserService;
    this.tokenService = TokenService;
  }

  register = async (req, res, next) => {
    try {
      const { value, password } = req.body;
      const candidate = await this.userService.findOne({ value });

      if (candidate) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: 'value Exist',
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }
      const hashPassword = await bcrypt.hash(password, 3);
      const user = await this.userService.create({
        value,
        password: hashPassword
      });
      const tokens = this.tokenService.generateTokens({
        id: user.id
      });
      await this.tokenService.saveToken(user.id, tokens.refreshToken, tokens.accessToken);

      return res.json({ tokens, user });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  login = async (req, res, next) => {
    try {
      const { value, password } = req.body;
      const user = await this.userService.findOne({ value });
      
       if (!user) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: l10n.user_not_found,
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }

      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) {
        const responseStatus = response.status.BAD_REQUEST;
        const data = response.dispatch({
          error: l10n.wrong_password,
          code: responseStatus
        });
        return res.status(responseStatus).json(data);
      }

      const tokens = this.tokenService.generateTokens({
        id: user.id
      });
      await this.tokenService.saveToken(user.id, tokens.refreshToken, tokens.accessToken);
      return res.json({ tokens });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  refreshTokens = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw ApiError.UnauthorizedError();
      }
      const userData = this.tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await this.tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError();
      }
      const user = await this.userService.findOne({ id: userData.id });
      const tokens = this.tokenService.generateTokens({ id: user.id });
      await this.tokenService.saveToken(user.id, tokens.refreshToken, tokens.accessToken);
      return res.json({ tokens });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  userInfo = async (req, res, next) => {
    try {
      const user = await this.userService.findOne({ id: req.user.id });
      return res.json({ user });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };

  logout = async (req, res, next) => {
    try {
      const authorizationHeader = req.headers.authorization;
      const accessToken = authorizationHeader.split(' ')[1];

      await this.tokenService.remove({ accessToken });
      return res.json({ status: true });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export default new AuthService();
