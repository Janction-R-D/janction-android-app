import {ParamHeartbeat} from '../types';
import {http} from '../utils';

export const performHeartbeat = async (token: string, params: ParamHeartbeat) => {
  await http.post('node/heartbeat', params, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });
};
