import React from "react";
import { Button, Layout, message, Space, Upload, Table, Divider, Alert } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import XLSX from "xlsx";

import "./style.css";

const map = {
    modal: '型号',
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reader: new FileReader(),
            contractData: [],
            contractLoading: false,
            systemData: [],
            systemLoading: false,
            columns: [],
            repeatDataSource: [],
            unRepeatDataSource: [],
            filterLoading: false,
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
        this.setState({
            type,
            [type + 'Loading']: true,
        }, () => reader.readAsBinaryString(file));
        return false;
    }

    handleFileReader = (event) => {
        const { type } = this.state;
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const dataSource = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        this.setState({
            [type + 'Data']: dataSource,
            [type + 'Loading']: false,
        });
        message.success('上传成功~');
    }

    handleFilter = () => {
        const { contractData, systemData } = this.state;
        const columns = [];
        const repeatDataSource = [];
        const unRepeatDataSource = [];
        if (contractData.length === 0) {
            message.error('请上传合同数据~');
            return;
        }
        if (systemData.length === 0) {
            message.error('请上传系统数据~');
            return;
        }
        Object.keys(contractData[0]).forEach(key => {
            columns.push({
                title: key,
                dataIndex: key,
            });
        });
        this.setState({ filterLoading: true }, () => {
            const len = systemData.length;
            contractData.forEach((item, index) => {
                const cModal = item[map.modal];
                let i = 0;
                for (; i < len; i++) {
                    const sModal = systemData[i][map.modal];
                    if (sModal && sModal.toString().indexOf(cModal) > -1) {
                        // 当前数据已存在系统中
                        repeatDataSource.push({ ...item, id: index });
                        break;
                    }
                }
                if (i >= len) {
                    // 当前数据不在系统中
                    unRepeatDataSource.push({ ...item, id: index });
                }
            });
            this.setState({ columns, repeatDataSource, unRepeatDataSource, filterLoading: false });
        });
    }

    render() {
        const {
            columns,
            unRepeatDataSource,
            contractLoading,
            systemLoading,
            filterLoading,
        } = this.state;

        return (
            <div className="app">
                <Layout className="layout">
                    <Layout.Content className="content">
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Alert message="温馨提示：请将要对比的列命名为 -- 型号" type="info" showIcon/>
                            <div>
                                <Space size="middle">
                                    <Upload
                                        beforeUpload={file => this.handleUploadFile(file, 'contract')}
                                        showUploadList={false}
                                    >
                                        <Button
                                            loading={contractLoading}
                                            icon={<UploadOutlined/>}
                                            type="primary"
                                        >
                                            上传合同数据
                                        </Button>
                                    </Upload>
                                    <Upload
                                        beforeUpload={file => this.handleUploadFile(file, 'system')}
                                        showUploadList={false}
                                    >
                                        <Button
                                            loading={systemLoading}
                                            icon={<UploadOutlined/>}
                                            type="primary"
                                        >
                                            上传系统数据
                                        </Button>
                                    </Upload>
                                    <Divider type="vertical"/>
                                    <Button onClick={this.handleFilter}>过滤</Button>
                                </Space>
                            </div>
                            <Table
                                loading={filterLoading}
                                bordered
                                rowKey="id"
                                columns={columns}
                                dataSource={unRepeatDataSource}
                            />
                        </Space>
                    </Layout.Content>
                </Layout>
            </div>
        );
    }
}

export default App;
