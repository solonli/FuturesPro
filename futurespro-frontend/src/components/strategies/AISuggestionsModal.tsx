import React, { useState, useEffect } from 'react';
import { Modal, Button, List, Typography, message, Spin } from 'antd';
import { useStrategyStore } from '../../store/strategyStore';

const { Title, Text } = Typography;

interface AISuggestionsModalProps {
  visible: boolean;
  onCancel: () => void;
  strategyId: number | null;
}

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({ visible, onCancel, strategyId }) => {
  const { getAISuggestions, loading } = useStrategyStore();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible && strategyId) {
      fetchSuggestions();
    }
  }, [visible, strategyId]);

  const fetchSuggestions = async () => {
    if (!strategyId) return;
    
    setIsLoading(true);
    try {
      const data = await getAISuggestions(strategyId);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      message.error('获取AI优化建议失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="AI优化建议"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
      width={600}
    >
      {isLoading || loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <Title level={5}>策略优化建议</Title>
          <List
            dataSource={suggestions}
            renderItem={(suggestion, index) => (
              <List.Item key={index} className="py-4">
                <List.Item.Meta
                  title={
                    <Text strong>{suggestion.title}</Text>
                  }
                  description={
                    <div>
                      <Text>{suggestion.description}</Text>
                      {suggestion.impact && (
                        <Text type="secondary" className="block mt-2">
                          预期影响: {suggestion.impact}
                        </Text>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
            locale={{ emptyText: '暂无优化建议' }}
          />
        </div>
      )}
    </Modal>
  );
};

export default AISuggestionsModal;
