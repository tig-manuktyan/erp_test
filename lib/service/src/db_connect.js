import winston from 'winston';
import configService from './../../shared/src/config/config.service.js';
import { Sequelize } from 'sequelize';

const { database, user, password, host, port } = configService.get('db.mysql');

export const sequelize = new Sequelize(database, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: winston.debug
});
