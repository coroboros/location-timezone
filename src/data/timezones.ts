import { parse } from 'zipson';
import timezonesJson from './timezones.json' with { type: 'json' };

export const timezones = parse(timezonesJson.data) as string[];
Object.freeze(timezones);
