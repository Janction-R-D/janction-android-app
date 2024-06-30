import {ParamGetNodeInfos, NodeInfo} from '../types';
import {http} from '../utils';

export const fetchNodeInfos = async (
  token: string,
  params: ParamGetNodeInfos,
) => {
  const res = await http.get('node/infos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
  return res.data as NodeInfo[];
};
