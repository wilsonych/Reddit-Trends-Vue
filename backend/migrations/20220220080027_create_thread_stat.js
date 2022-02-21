const THREAD_STAT = "THREAD_STAT";
const THREAD = "THREAD";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable(THREAD_STAT).then((exists) => {
        if (!exists) {
            knex.schema
                .createTable(THREAD_STAT, (table) => {
                    table.string("id").notNullable();
                    table.decimal("vote").notNullable();
                    table.decimal("comment").notNullable();
                    table.datetime("updated").defaultTo(knex.fn.now());
                    table.foreign("id").references("id").inTable(THREAD);

                    table.primary(["id", "updated"]);
                })
                .catch((error) => console.log(error));
        } else {
            console.log(THREAD_STAT, " existed");
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable(THREAD_STAT);
};
