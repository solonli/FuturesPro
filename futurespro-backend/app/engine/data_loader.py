import pandas as pd
from datetime import datetime, timedelta
import numpy as np


class DataLoader:
    """数据加载器"""
    
    def get_historical_data(self, contract_id: int, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """
        获取历史数据
        
        Args:
            contract_id: 合约ID
            start_date: 开始日期
            end_date: 结束日期
            
        Returns:
            历史数据DataFrame
        """
        # 这里使用模拟数据
        # 实际应用中应该从数据库或API获取真实数据
        date_range = pd.date_range(start=start_date, end=end_date, freq='D')
        
        # 生成模拟数据
        data = {
            'datetime': date_range,
            'open': np.random.uniform(3800, 4200, len(date_range)),
            'high': np.random.uniform(3850, 4250, len(date_range)),
            'low': np.random.uniform(3750, 4150, len(date_range)),
            'close': np.random.uniform(3800, 4200, len(date_range)),
            'volume': np.random.randint(1000, 10000, len(date_range))
        }
        
        df = pd.DataFrame(data)
        
        # 确保数据按时间排序
        df = df.sort_values('datetime')
        
        return df
    
    def get_contract_info(self, contract_id: int) -> dict:
        """
        获取合约信息
        
        Args:
            contract_id: 合约ID
            
        Returns:
            合约信息字典
        """
        # 这里使用模拟数据
        # 实际应用中应该从数据库获取真实数据
        contract_info = {
            1: {'symbol': 'rb2510', 'name': '螺纹钢2510', 'multiplier': 10},
            2: {'symbol': 'cu2509', 'name': '铜2509', 'multiplier': 5},
            3: {'symbol': 'a2509', 'name': '大豆2509', 'multiplier': 10}
        }
        
        return contract_info.get(contract_id, {'symbol': 'unknown', 'name': '未知合约', 'multiplier': 1})
