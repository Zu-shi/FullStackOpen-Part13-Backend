const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')
//const index = require('../models/index')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }

  return null
}


const queryInterface = sequelize.getQueryInterface();

if (!queryInterface) {
  console.log('Failed to get queryInterface');
  process.exit(1);
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js', // interesting! imported as globs
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(), // program to run the migrations
  logger: console, // logging storage
}

const runMigrations = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()

  console.log('Migraitions up to date', {
    files: migrations.map((mig) => mig.name)
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }