import {ParamCreateDeviceInfo} from '../types';
import {http} from '../utils';

export const fetchDeviceInfo = async (wallet_address?: string) => {
  await http.get('device/info', {
    params: {
      wallet_address,
    },
  });
};

export const submitDeviceInfo = async (token: string, params: ParamCreateDeviceInfo) => {
  return await http.post('device/info', params, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
  });
};
