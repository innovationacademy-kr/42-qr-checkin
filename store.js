const { Sequelize, Model, DataTypes } = require('sequelize');
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST || 'localhost';

// const sequelize = new Sequelize('sqlite::memory:');
const sequelize = (DB_NAME) ?
  new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql'
  }) : new Sequelize('sqlite::/tmp/testdb');

class Attend extends Model { }
Attend.init({
  event: DataTypes.STRING,
  username: DataTypes.STRING,
  created: DataTypes.DATE
}, { sequelize, modelName: 'attend' });

async function save(attend) {
  await sequelize.sync();
  const result = await Attend.findAll({
    where: { event: attend.event, username: attend.username }
  });
  console.log(result);
  if (result.length === 0) {
    const result2 = await Attend.create(attend);
    console.log(result2);
    return result2;
  } else {
    throw new Error('Already registered!');
  }
};
async function findAll() {
  await sequelize.sync();
  const result = await Attend.findAll({});
  return result;
}

module.exports = {
  save,
  findAll
};
