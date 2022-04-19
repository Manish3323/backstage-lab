import {
    TechRadarApi,
    TechRadarLoaderResponse,
} from '@backstage/plugin-tech-radar';
import { Config } from '@backstage/config';

export class TechRadar {
    static fromConfig(config: Config): TechRadarApi {
        return {
            async load(): Promise < TechRadarLoaderResponse > {
                const baseUrl = config.getString('backend.baseUrl');
                const data = await fetch(`${baseUrl}/api/techradar/radar-data`);
    
                return data.json();
            }
        }
    }
}
