import {ParamLogin} from '../types';
import {http} from '../utils';

export const fetchNonce = async () => {
  const res = await http.get('auth/nonce');
  return res.data.nonce;
};

export const performLogin = async (params: ParamLogin) => {
  const res = await http.post('auth/login', params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.token;
};
