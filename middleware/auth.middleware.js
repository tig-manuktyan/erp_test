import ApiError from './../lib/shared/src/error/ApiError';
import tokenService from '../src/components/token/token.service';
import Token from '../lib/service/src/model/token/token';

export default async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    // Проверяем, существует ли токен в базе данных
    const tokenRecord = await Token.findOne({ where: { accessToken } });
    if (!tokenRecord) {
      return next(ApiError.UnauthorizedError());
    }

    // Валидируем токен (вы можете использовать свою логику в tokenService)
    const userData = await tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Auth error' });
  }
};
