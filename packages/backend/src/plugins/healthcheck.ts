import { 
  createStatusCheckRouter,
  PluginDatabaseManager
} from '@backstage/backend-common';
import { PluginEnvironment } from '../types';


function checkDB(database:PluginDatabaseManager ): () => Promise<any> {
  return async () => {
    let dbStatus;
    try {
      const db = await database.getClient()
      db.raw("select 1+1 as result");
      dbStatus = 'ok';
    } catch (error) {
      dbStatus = "No DB Connection.";
    }
    
    return {
      dbStatus
    }
  }
}

export default async function createRouter({ logger, database }: PluginEnvironment) {
  
  return await createStatusCheckRouter({ logger, path: '/readiness',  statusCheck: checkDB (database)});
}