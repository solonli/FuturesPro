import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useStrategyStore } from '../../store/strategyStore';
import type { StrategyCreate, StrategyUpdate } from '../../types/strategy';

const { TextArea } = Input;

interface StrategyFormProps {
  visible: boolean;
  onCancel: () => void;
  strategy: any;
}

const strategyTypes = [
  { value: 'trend_following', label: '趋势跟踪' },
  { value: 'mean_reversion', label: '均值回归' },
  { value: 'breakout', label: '突破策略' },
  { value: 'momentum', label: '动量策略' },
  { value: 'arbitrage', label: '套利策略' },
];

const StrategyForm: React.FC<StrategyFormProps> = ({ visible, onCancel, strategy }) => {
  const [form] = Form.useForm();
  const { createStrategy, updateStrategy, loading } = useStrategyStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (strategy) {
      form.setFieldsValue({
        name: strategy.name,
        description: strategy.description,
        type: strategy.type,
        config: JSON.stringify(strategy.config, null, 2),
      });
    } else {
      form.resetFields();
    }
  }, [strategy, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      let config;
      try {
        config = JSON.parse(values.config);
      } catch (error) {
        message.error('配置格式错误，请输入有效的JSON');
        setIsSubmitting(false);
        return;
      }

      if (strategy) {
        // 更新策略
        await updateStrategy(strategy.id, {
          name: values.name,
          description: values.description,
          type: values.type,
          config,
        } as StrategyUpdate);
        message.success('策略更新成功');
      } else {
        // 创建策略
        await createStrategy({
          name: values.name,
          description: values.description,
          type: values.type,
          config,
        } as StrategyCreate);
        message.success('策略创建成功');
      }

      onCancel();
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={strategy ? '编辑策略' : '新建策略'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isSubmitting || loading}
        >
          {strategy ? '更新' : '创建'}
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="策略名称"
          rules={[{ required: true, message: '请输入策略名称' }]}
        >
          <Input placeholder="请输入策略名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="策略描述"
          rules={[{ required: true, message: '请输入策略描述' }]}
        >
          <TextArea rows={3} placeholder="请输入策略描述" />
        </Form.Item>

        <Form.Item
          name="type"
          label="策略类型"
          rules={[{ required: true, message: '请选择策略类型' }]}
        >
          <Select placeholder="请选择策略类型">
            {strategyTypes.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="config"
          label="策略配置 (JSON格式)"
          rules={[{ required: true, message: '请输入策略配置' }]}
        >
          <TextArea
            rows={6}
            placeholder="请输入JSON格式的策略配置"
            style={{ fontFamily: 'monospace' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default StrategyForm;
