import pg, { type PoolConfig } from "pg";

export const createPool = () => {
  const postgresOptions: PoolConfig = {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "",
    database: "efiliba",
  };

  return new pg.Pool(postgresOptions);
};
