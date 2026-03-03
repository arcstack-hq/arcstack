export interface AdapterFactoryOptions {
    connectionString: string;
}

export interface DatabaseAdapterFactory<TAdapter> {
    (options: AdapterFactoryOptions): TAdapter;
}

export interface DatabaseClientFactory<TAdapter, TClient> {
    (options: { adapter: TAdapter }): TClient;
}

export interface CreateDatabaseClientOptions<TAdapter, TClient> {
    connectionString?: string;
    createAdapter: DatabaseAdapterFactory<TAdapter>;
    createClient: DatabaseClientFactory<TAdapter, TClient>;
}

export const createDatabaseClient = <TAdapter, TClient> (
    options: CreateDatabaseClientOptions<TAdapter, TClient>,
): TClient => {
    const connectionString = options.connectionString ?? process.env.DATABASE_URL ?? "";
    const adapter = options.createAdapter({ connectionString });

    return options.createClient({ adapter });
};
