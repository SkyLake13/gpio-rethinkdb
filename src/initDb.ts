import { Connection, r } from "rethinkdb-ts";

const initDb = async(connection: Connection, switches: any[]) => {
    const dbs = await r.dbList().run(connection);

    if(!dbs.find(x => x === 'test')) {
        await r.dbCreate('test').run(connection);
    }

    const tables = await r.db('test').tableList().run(connection);

    if(tables.length === 0) {
        await r.db('test').tableCreate('switches').run(connection);
        const x = await addSwitches(connection, switches);
        console.log('switches added ', x);
    }
}

const addSwitches = (connection: Connection, data: any) => {
    return r.table('switches').insert(data).run(connection);
}

export default initDb;
