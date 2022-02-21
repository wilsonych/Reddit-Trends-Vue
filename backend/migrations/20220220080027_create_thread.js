const THREAD = "THREAD";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable(THREAD).then((exists) => {
        if (!exists) {
            knex.schema
                .createTable(THREAD, (table) => {
                    table.string("id").primary();
                    table.string("title").notNullable();
                    table.string("forum").notNullable();
                    table.string("created").notNullable();
                })
                .catch((error) => console.log(error));
        } else {
            console.log(THREAD, " existed");
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable(THREAD);
};
