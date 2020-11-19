import React from "react";
import { Button, Layout, message, Space, Upload, Table, Divider } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import XLSX from "xlsx";

import "./style.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reader: new FileReader(),
            contractData: [],
            systemData: [],
            columns: [],
            dataSource: [],
            type: null,
        };
    }

    componentDidMount() {
        const { reader } = this.state;
        reader.onload = (event) => {
            this.handleFileReader(event);
        };
    }

    handleUploadFile = (file, type) => {
        const { reader } = this.state;
        this.setState({ type }, () => reader.readAsBinaryString(file));
        return false;
    }

    handleFileReader = (event) => {
        const { type } = this.state;
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const dataSource = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        this.setState({ [type + 'Data']: dataSource });
        message.success('上传成功~');
    }

    handleFilter = () => {
        const { contractData, systemData } = this.state;
        if (contractData.length === 0) {
            message.error('请上传合同数据~');
            return;
        }
        if (systemData.length === 0) {
            message.error('请上传系统数据~');
            return;
        }
        console.log(123);
    }


    render() {
        const { columns, dataSource } = this.state;

        return (
            <div className="app">
                <Layout className="layout">
                    <Layout.Content className="content">
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div>
                                <Space size={16}>
                                    <Upload
                                        beforeUpload={file => this.handleUploadFile(file, 'contract')}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined/>} type="primary">上传合同数据</Button>
                                    </Upload>
                                    <Upload
                                        beforeUpload={file => this.handleUploadFile(file, 'system')}
                                        showUploadList={false}
                                    >
                                        <Button icon={<UploadOutlined/>} type="primary">上传系统数据</Button>
                                    </Upload>
                                </Space>
                                &nbsp;&nbsp;
                                <Divider type="vertical" />
                                &nbsp;&nbsp;
                                <Button onClick={this.handleFilter}>过滤</Button>
                            </div>
                            <Table
                                bordered
                                columns={columns}
                                dataSource={dataSource}
                            />
                        </Space>
                    </Layout.Content>
                </Layout>
            </div>
        );
    }
}

export default App;
