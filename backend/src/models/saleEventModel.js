import db from '../config/mysql.js';

const table_name = 'sale_event';
let ensureSchemaPromise = null;

const normalizeSaleDuration = (value) => {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
        return 7;
    }

    return parsed;
};

const toMysqlDateTime = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const buildSchedule = (saleDuration) => {
    const normalizedDuration = normalizeSaleDuration(saleDuration);
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + normalizedDuration * 24 * 60 * 60 * 1000);

    return {
        saleDuration: normalizedDuration,
        startDate: toMysqlDateTime(startDate),
        endDate: toMysqlDateTime(endDate),
    };
};

const SaleEventModel = {
    ensureSchema: async () => {
        if (!ensureSchemaPromise) {
            ensureSchemaPromise = (async () => {
                const [columns] = await db.query(`SHOW COLUMNS FROM ${table_name}`);
                const columnsByName = new Map(columns.map((column) => [column.Field, column]));

                if (!columnsByName.has('start_date')) {
                    await db.query(`ALTER TABLE ${table_name} ADD COLUMN start_date DATETIME NULL`);
                } else if (!String(columnsByName.get('start_date')?.Type || '').toLowerCase().includes('datetime')) {
                    await db.query(`ALTER TABLE ${table_name} MODIFY COLUMN start_date DATETIME NULL`);
                }

                if (!columnsByName.has('end_date')) {
                    await db.query(`ALTER TABLE ${table_name} ADD COLUMN end_date DATETIME NULL`);
                } else if (!String(columnsByName.get('end_date')?.Type || '').toLowerCase().includes('datetime')) {
                    await db.query(`ALTER TABLE ${table_name} MODIFY COLUMN end_date DATETIME NULL`);
                }

                if (!columnsByName.has('is_active')) {
                    await db.query(`ALTER TABLE ${table_name} ADD COLUMN is_active TINYINT(1) NULL DEFAULT 1`);
                }
            })();
        }

        await ensureSchemaPromise;
    },

    getAll: async () => {
        await SaleEventModel.ensureSchema();
        const [rows] = await db.query(`
            SELECT *
            FROM ${table_name}
        `);
        return rows;
    },

    getById: async (saleId) => {
        await SaleEventModel.ensureSchema();
        const [rows] = await db.query(
            `SELECT * FROM ${table_name} WHERE sale_id = ?`,
            [saleId]
        );
        return rows[0] || null;
    },

    create: async (saleType, saleValue, saleDuration) => {
        await SaleEventModel.ensureSchema();
        const schedule = buildSchedule(saleDuration);
        const [result] = await db.query(
            `INSERT INTO ${table_name} (sale_type, sale_value, sale_duration, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
            [saleType, saleValue, schedule.saleDuration, schedule.startDate, schedule.endDate]
        );
        return result.insertId;
    },

    update: async (saleId, saleType, saleValue, saleDuration) => {
        await SaleEventModel.ensureSchema();
        const schedule = buildSchedule(saleDuration);
        const [result] = await db.query(
            `UPDATE ${table_name} SET sale_type = ?, sale_value = ?, sale_duration = ?, start_date = ?, end_date = ?, is_active = 1 WHERE sale_id = ?`,
            [saleType, saleValue, schedule.saleDuration, schedule.startDate, schedule.endDate, saleId]
        );
        return result.affectedRows;
    },

    delete: async (saleId) => {
        await SaleEventModel.ensureSchema();
        const [result] = await db.query(
            `DELETE FROM ${table_name} WHERE sale_id = ?`,
            [saleId]
        );
        return result.affectedRows;
    },
};

export default SaleEventModel;
