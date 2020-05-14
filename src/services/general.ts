/*
 * @Descripttion: 
 * @version: 
 * @Author: huhu
 */
import request from '@/utils/request';

/* 配送点操作 */
export async function queryTask(params?: TableListParams) {
    return request('/api/task', {
        params,
    });
}

export async function addTask(params: TableListParams) {
    return request('/api/task/create', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}
export async function deleteTask(params?: TableListParams) {
    return request('/api/task/destory', {
        method: 'POST',
        data: {
            ...params,
            method: 'destory',
        },
    });
}

export async function updateTask(params: TableListParams) {
    return request('/api/task/update', {
        method: 'POST',
        data: {
            ...params,
            method: 'update',
        },
    });
}


/* vehicle操作 */
export async function queryVehicle(params?: TableListParams) {
    return request('/api/vehicle', {
        params,
    });
}

export async function addVehicle(params: TableListParams) {
    return request('/api/vehicle/create', {
        method: 'POST',
        data: {
            ...params,
        },
    });
}

export async function deleteVehicle(params?: TableListParams) {
    return request('/api/vehicle/destory', {
        method: 'POST',
        data: {
            ...params,
            method: 'destory',
        },
    });
}

/* vehicleType操作 */
export async function queryVehicleType(params?: TableListParams) {
    return request('/api/vehicleType', {
        params,
    });
}

export async function addVehicleType(params?: TableListParams) {
    return request('/api/vehicleType/create', {
        method: 'POST',
        data: {
            ...params,
            method: 'create',
        },
    });
}









