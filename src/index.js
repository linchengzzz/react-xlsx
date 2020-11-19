import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/antd.css';
import { ConfigProvider } from "antd";

ReactDOM.render(
    <ConfigProvider local={zhCN}>
        <App/>
    </ConfigProvider>,
    document.getElementById('root')
);
