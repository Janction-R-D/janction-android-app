import { Device, ExecInfo, GPUInfo, ParamHeartbeat, SystemInfo } from "../types"

export const convertDeviceToParamHeartbeat = (device: Device) => {
    const gpuInfo: GPUInfo = {}
    const systemInfo: SystemInfo  = {
        os_type: "android",
        architecture: "arm",
        board_serial_number: device.uniqueId,
        platform_uuid: "",
        mac_address: device.macAddress
    }
    const execInfo: ExecInfo = {
        use_cpu: 1,
        use_gpu: 0
    }
    const paramHeartbeat: ParamHeartbeat = {
        gpu_info: gpuInfo,
        system_info: systemInfo,
        exec_info: execInfo
    } 
    return paramHeartbeat
}