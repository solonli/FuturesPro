import React, { useEffect, useState } from 'react';
import { useStrategyStore } from '../../store/strategyStore';
import { Button, Card, Input, Tag, Tooltip, message } from 'antd';
import { EditOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import StrategyForm from './StrategyForm';
import AISuggestionsModal from './AISuggestionsModal';

const { Search } = Input;

const StrategyList: React.FC = () => {
  const { 
    strategies, 
    error, 
    fetchStrategies, 
    startStrategy, 
    stopStrategy 
  } = useStrategyStore();
  
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<any>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const handleCreate = () => {
    setEditingStrategy(null);
    setIsModalOpen(true);
  };

  const handleEdit = (strategy: any) => {
    setEditingStrategy(strategy);
    setIsModalOpen(true);
  };

  const handleStart = async (id: number) => {
    try {
      await startStrategy(id);
      message.success('策略启动成功');
    } catch (error) {
      message.error('策略启动失败');
    }
  };

  const handleStop = async (id: number) => {
    try {
      await stopStrategy(id);
      message.success('策略停止成功');
    } catch (error) {
      message.error('策略停止失败');
    }
  };

  const handleAISuggestions = (id: number) => {
    setSelectedStrategyId(id);
    setIsAIModalOpen(true);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Tag color="green">运行中</Tag>;
      case 'PAUSED':
        return <Tag color="yellow">暂停中</Tag>;
      case 'DRAFT':
        return <Tag color="gray">草稿</Tag>;
      default:
        return <Tag color="blue">未知</Tag>;
    }
  };

  const filteredStrategies = strategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Search
          placeholder="搜索策略"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleCreate}>
          新建策略
        </Button>
      </div>
      
      {error && <div className="mb-4 text-red-500">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrategies.map((strategy) => (
          <Card key={strategy.id} className="bg-dark-300 border-color-border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{strategy.name}</h3>
                <p className="text-text-secondary text-sm mt-1">{strategy.type}</p>
              </div>
              {getStatusTag(strategy.status)}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">总收益率</span>
                <span className={`font-mono ${strategy.total_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {strategy.total_pnl ? `${strategy.total_pnl > 0 ? '+' : ''}${strategy.total_pnl}%` : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">胜率</span>
                <span className="font-mono">
                  {strategy.win_rate ? `${strategy.win_rate}%` : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">最大回撤</span>
                <span className="font-mono text-red-500">
                  -8.2%
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
              <Tooltip title="编辑策略">
                <Button 
                  icon={<EditOutlined />} 
                  onClick={() => handleEdit(strategy)}
                  className="flex-1 bg-dark-400 hover:bg-dark-500 text-text-primary"
                >
                  编辑
                </Button>
              </Tooltip>
              
              {strategy.status === 'ACTIVE' ? (
                <Tooltip title="停止策略">
                  <Button 
                    icon={<PauseCircleOutlined />} 
                    onClick={() => handleStop(strategy.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    停止
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="启动策略">
                  <Button 
                    icon={<PlayCircleOutlined />} 
                    onClick={() => handleStart(strategy.id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    启动
                  </Button>
                </Tooltip>
              )}
              
              <Tooltip title="AI优化建议">
                <Button 
                  onClick={() => handleAISuggestions(strategy.id)}
                  className="flex-1 bg-primary hover:bg-primary/80 text-white"
                >
                  AI优化
                </Button>
              </Tooltip>
            </div>
          </Card>
        ))}
      </div>
      
      <StrategyForm
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        strategy={editingStrategy}
      />
      
      <AISuggestionsModal
        visible={isAIModalOpen}
        onCancel={() => setIsAIModalOpen(false)}
        strategyId={selectedStrategyId}
      />
    </div>
  );
};

export default StrategyList;
