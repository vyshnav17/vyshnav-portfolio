import {sqliteTable,integer,text} from "drizzle-orm/sqlite-core";
export const portfolio = sqliteTable("portfolio",{
 id:integer("id").primaryKey(),version:integer("version").notNull(),document:text("document").notNull()
});
