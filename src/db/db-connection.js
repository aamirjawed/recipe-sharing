import { Sequelize } from 'sequelize'  
import dotenv from 'dotenv'

dotenv.config({
  path: './.env'
})

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306, 
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true
      }
    }
  }
)

;(async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database in db connection:', error.message)
  }
})()

export default sequelize
