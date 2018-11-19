import { Connection, r } from "rethinkdb-ts";
import initDb from './src/initDb';
import monitorSwitches from './src/job';
import Switch from "./src/switch";

const tableName = 'switches';
const interval = 1000;
const switches = [
    new Switch('TV', 'tv', 0, 0),
    new Switch('Speaker', 'speaker', 0, 0)
];

const connection = async() => {
    const options = {
        host: 'localhost', port: 28015
    };

    return await r.connect(options);
}


const main = async() => {
    const conn = await connection();
    await initDb(conn, switches);
    
    setInterval(async() => {
        await monitorSwitches(conn, tableName, interval);
        console.log('job started');
    }, interval);
}

main().then(() => {
    console.log('function f called');
});



