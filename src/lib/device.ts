/**
 * This browser's device id, the web's counterpart of the apps' DeviceId: made once by the proxy,
 * kept in a cookie, and sent as DEVICE_HEADER on every request the server makes to Supabase for
 * this browser. The cloud puts it on the "this store changed" broadcasts those writes cause, so
 * LiveStore can tell the echo of this browser's own writes from changes made elsewhere.
 *
 * Prefixed "web-" so a broadcast, or anything else that records the writer's device, shows the
 * change came from the web dashboard. A label, not an identity: nothing authenticates with it.
 * Readable by the page (not httpOnly) because LiveStore compares against it.
 */
export const DEVICE_COOKIE = "doline_device";
export const DEVICE_HEADER = "x-doline-device";
export const DEVICE_PREFIX = "web-";

export const isWebDeviceId = (v: string | undefined | null): v is string => !!v && v.startsWith(DEVICE_PREFIX) && v.length <= 64;

export const newWebDeviceId = () => DEVICE_PREFIX + crypto.randomUUID();
