import { Table, message } from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';
import { routePlanning } from "../../../services/general"

const columns = [
    {
        title: '车辆编号',
        dataIndex: 'id',
        // key: 'id',
        // render: text => <a>{text}</a>,
    },
    {
        title: '配送路线',
        dataIndex: 'route',
        // key: 'route', 
    },
];

const data = [];


const handleRoutePlanning = async () => {
    let path= [];
    let route = [];
    const hide = message.loading("正在规划路径...");
    const res = await routePlanning();
    console.log("res:", res);
    res.then(data => {
        path = data;
        console.log("data:", path);
    })

    for (let i = 0; i < path.length; i++) {

        const temp=path[i].join("-->");
        route.push(temp);
    }

    console.log("route:", route);

    for (let i = 0; i < route.length; i++) {
        data.push({
            key: i,
            id: `Edward King ${i}`,
            address: `London, Park Lane no. ${i}`,
        });
    }

    hide(); // 正在添加loading消失
    if (!res.success) return false; // 如果失败就return false
    message.success("修改需求量成功"); // 成功则提示添加成功并return true
    // action.reload(); // 刷新表格
    return true;
};




ReactDOM.render(<Table columns={columns} dataSource={data} />, mountNode);



// const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//     },
//     {
//       title: 'Age',
//       dataIndex: 'age',
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//     },
//   ];
// for (let i = 0; i < 46; i++) {
//     data.push({
//       key: i,
//       name: `Edward King ${i}`,
//       age: 32,
//       address: `London, Park Lane no. ${i}`,
//     });
//   }