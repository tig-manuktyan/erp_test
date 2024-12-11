import { Op, literal, fn, col, cast } from 'sequelize';
import qs from 'sequelize/lib/sql-string';

export const literalOptions = {
  literal: literal,
  tsQuery: (val) =>
    (Object.keys(val)[0] &&
      literal(
        `"${Object.keys(val)[0]}" @@ to_tsquery(${qs.escape(
          Object.values(val)[0].replace(new RegExp(' ', 'g'), '&'),
          null,
          'postgres'
        )})`
      )) ||
    null,
  websearchQuery: (val) =>
    (Object.keys(val)[0] &&
      literal(
        `"${Object.keys(val)[0]}" @@ websearch_to_tsquery(${qs.escape(
          Object.values(val)[0],
          null,
          'postgres'
        )})`
      )) ||
    null,
  fn: fn,
  col: col,
  cast: cast
};

export const metaOptions = {
  adjacent: Op.adjacent,
  all: Op.all,
  and: Op.and,
  any: Op.any,
  between: Op.between,
  col: Op.col,
  contained: Op.contained,
  contains: Op.contains,
  endsWith: Op.endsWith,
  eq: Op.eq,
  gt: Op.gt,
  gte: Op.gte,
  iLike: Op.iLike,
  in: Op.in,
  iRegexp: Op.iRegexp,
  is: Op.is,
  like: Op.like,
  lt: Op.lt,
  lte: Op.lte,
  match: Op.match,
  ne: Op.ne,
  noExtendLeft: Op.noExtendLeft,
  noExtendRight: Op.noExtendRight,
  not: Op.not,
  notBetween: Op.notBetween,
  notILike: Op.notILike,
  notIn: Op.notIn,
  notIRegexp: Op.notIRegexp,
  notLike: Op.notLike,
  notRegexp: Op.notRegexp,
  or: Op.or,
  overlap: Op.overlap,
  placeholder: Op.placeholder,
  regexp: Op.regexp,
  startsWith: Op.startsWith,
  strictLeft: Op.strictLeft,
  strictRight: Op.strictRight,
  substring: Op.substring,
  values: Op.values
};
