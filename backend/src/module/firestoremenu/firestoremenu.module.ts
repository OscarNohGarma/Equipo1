import { Module,DynamicModule } from '@nestjs/common';
import { Firestore, Settings } from '@google-cloud/firestore';
import {FirestoreDatabaseProvider,FirestoreOptionsProvider,
    FirestoreCollectionProviders,
    } from '../../providers/firestore.providers'

type FirestoreModuleOptions = {
    imports: any[];
    useFactory: (...args: any[]) => Settings;
    inject: any[];
};
@Module({})
export class FirestoreMenuModule{
    static forRoot(options: FirestoreModuleOptions): DynamicModule{
        const optionsProvider = {
            provide: FirestoreOptionsProvider,
            useFactory: options.useFactory,
            inject: options.inject,
        };
        const dbProvider = {
            provide: FirestoreDatabaseProvider,
            useFactory: (config: Settings) => new Firestore(config),
            inject: [FirestoreOptionsProvider],
        };
        const collectionProviders = FirestoreCollectionProviders.map(providerName => ({
            provide: providerName,
            useFactory: (db: { collection: (arg0: string) => any; }) => db.collection(providerName),
            inject: [FirestoreDatabaseProvider],
        }));
        return{
            global: true,
            module: FirestoreMenuModule,
            imports: options.imports,
            providers: [optionsProvider, dbProvider, ...collectionProviders],
            exports: [dbProvider, ...collectionProviders],
        };
    }
}

