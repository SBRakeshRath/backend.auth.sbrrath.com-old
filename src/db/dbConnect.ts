
import * as dotenv from "dotenv";
dotenv.config();

const   clientData = {
    host:process.env.sbrrathDbHost,
    port: Number(process.env.sbrrathDbPort),
    database:process.env.sbrrathDbName,
    user:process.env.sbrrathDbUser,
    password:process.env.sbrrathDbPassword
}


export default clientData




