import { DeviceEventEmitter } from 'react-native';

const EVENT = 'activity:refresh';

export const emitActivityRefresh = () => DeviceEventEmitter.emit(EVENT);
export const onActivityRefresh = (cb: () => void) =>
  DeviceEventEmitter.addListener(EVENT, cb);