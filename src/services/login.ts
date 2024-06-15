import {ParamLogin} from '../types';
import {http} from '../utils';

export const fetchNonce = async () => {
  const res = await http.get('nonce');
  return res.data.nonce;
};

export const login = async (params: ParamLogin) => {
  const res = await http.post('login', params, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data.token;
};
