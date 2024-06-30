export interface ParamLogin {
  message: string;
  signature: string;
  is_node: boolean;
}

export interface ParamHeartbeat {
  gpu_info: GPUInfo;
  system_info: SystemInfo;
  exec_info: ExecInfo;
}

export interface ParamGetNodeInfos {
  wallet_address?: string;
  node_type?: 'macos' | 'linux' | 'windows' | 'android';
  node_status?: NodeStatus;
}

export interface NodeInfo {
  node_id: string,
  heartbeat_count: number,
  node_type: string;
  architecture_type: string;
  gpu_info: object;
  system_info: object;
  exec_info: object;
  node_status: NodeStatus;
}

export interface GPUInfo {}

export interface SystemInfo {
  os_type: 'android';
  architecture: 'arm';
  board_serial_number: string;
  platform_uuid: string;
  mac_address: string;
}

export interface ExecInfo {
  use_cpu: 0 | 1;
  use_gpu: 0 | 1;
}

export enum NodeStatus {
  Available = 1,
  Running = 2,
  Offline = 3,
}
