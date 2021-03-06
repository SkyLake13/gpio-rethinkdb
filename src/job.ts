import { Connection, r } from "rethinkdb-ts";
import Switch from "./switch";


const monitorSwitches = async(connection: Connection, switchesTableName: string, interval: number) => {
    const switches = await r.table<Switch>(switchesTableName).run(connection);
    if(switches && Array.isArray(switches)) {
        switches.forEach((sw: Switch) => {
            updateSwitch(sw, connection, switchesTableName, interval);
        });
    }
}

const updateSwitch = async(sw: Switch, connection: Connection, switchesTableName: string, interval: number) => {
    if(sw.timeout && sw.state == 1) {
        if(sw.timeout > interval) {
            updateTimer(sw, connection, switchesTableName, interval);
        } else {
            await switchOff(sw, connection, switchesTableName);
        }
    }
}

const switchOff = async(sw: Switch, connection: Connection, switchesTableName: string) => {
    sw.timeout = 0;
    sw.state = 0;

    await update(sw, connection, switchesTableName);
}

const updateTimer = async (sw: Switch, connection: Connection, switchesTableName: string, interval: number) => {
    sw.timeout = sw.timeout - interval;

    await update(sw, connection, switchesTableName);
}

const update = async(sw: Switch, connection: Connection, switchesTableName: string) => {
    await r.table(switchesTableName).filter(r.row('url').eq(sw.url)).update(sw).run(connection);

    const switches = await r.table<Switch>(switchesTableName).run(connection);
    console.log('----switches updated----', switches);
}

export default monitorSwitches;
