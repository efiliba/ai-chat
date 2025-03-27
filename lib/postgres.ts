import pg, { type PoolConfig, type Pool } from "pg";

export { type Pool as PoolType };

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
