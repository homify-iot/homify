///////////////////////////////////////////////////
// DON'T MODIFY THIS FILE
// Add configs to the `.dotenv` file, items starting with `CONFIG_`
// Add any types to `/types/Config.d.ts`
//////////////////////////////////////////////////
import { Config } from '@/types/Config';

declare global {
    interface Window {
        __APPCONFIG__: Config;
    }
}

const windowConfig: Config = window.__APPCONFIG__ || null;
export default windowConfig;