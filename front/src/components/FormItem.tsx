import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
} from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const FormItem: React.FC = () => {
    return (
        <>
            <Form
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{
                    maxWidth: 900,
                    background: "white",
                    padding: "25px",
                    borderRadius: "10px"
                }}
            >
                <Form.Item label="Name">
                    <Input />
                </Form.Item>
                <Form.Item label="Description">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Quantity">
                    <Slider />
                </Form.Item>
                <Form.Item label="Expiration">
                    <DatePicker />
                </Form.Item>
                <Form.Item label="Status">
                    <Select>
                        <Select.Option value="manufacturing">Manufacturing Process</Select.Option>
                        <Select.Option value="transit">Transit</Select.Option>
                        <Select.Option value="storage">Storage</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Investment Token">
                    <Input placeholder="0x000000000" />
                </Form.Item>
                <Form.Item label="Investment Amount">
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Expected Return Amount">
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Expected return period">
                    <DatePicker />
                </Form.Item>
                <Form.Item label="Photos" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload action="/upload.do" listType="picture-card">
                        <button style={{ border: 0, background: 'none' }} type="button">
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </button>
                    </Upload>
                </Form.Item>

                <Button>Add</Button>
            </Form >
        </>
    );
};

export default () => <FormItem />;