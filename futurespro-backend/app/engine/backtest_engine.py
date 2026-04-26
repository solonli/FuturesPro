import backtrader as bt
from datetime import datetime
from typing import Dict, Any, List, Tuple
import pandas as pd


class BacktestEngine:
    """回测引擎核心类"""
    
    def __init__(self):
        self.cerebro = None
        self.results = None
    
    def run_backtest(self, strategy_class: type, data: pd.DataFrame, 
                     initial_capital: float, strategy_params: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        运行回测
        
        Args:
            strategy_class: 策略类
            data: 回测数据
            initial_capital: 初始资金
            strategy_params: 策略参数
            
        Returns:
            回测结果字典
        """
        # 初始化回测引擎
        self.cerebro = bt.Cerebro()
        self.cerebro.broker.setcash(initial_capital)
        self.cerebro.broker.setcommission(commission=0.0002)
        
        # 添加数据
        data_feed = bt.feeds.PandasData(
            dataname=data,
            datetime='datetime',
            open='open',
            high='high',
            low='low',
            close='close',
            volume='volume',
            openinterest=None
        )
        self.cerebro.adddata(data_feed)
        
        # 添加策略
        if strategy_params:
            self.cerebro.addstrategy(strategy_class, **strategy_params)
        else:
            self.cerebro.addstrategy(strategy_class)
        
        # 运行回测
        self.results = self.cerebro.run()
        
        # 计算结果
        return self._calculate_results(initial_capital)
    
    def _calculate_results(self, initial_capital: float) -> Dict[str, Any]:
        """
        计算回测结果
        
        Args:
            initial_capital: 初始资金
            
        Returns:
            回测结果字典
        """
        if not self.results:
            return {}
        
        strategy = self.results[0]
        final_capital = self.cerebro.broker.getvalue()
        total_return = (final_capital - initial_capital) / initial_capital * 100
        
        # 计算最大回撤
        max_drawdown = self._calculate_max_drawdown(strategy)
        
        # 计算夏普比率（简化版）
        sharpe_ratio = self._calculate_sharpe_ratio(strategy)
        
        # 获取交易记录
        trades = self._get_trades(strategy)
        
        # 获取资金曲线
        equity_curve = self._get_equity_curve()
        
        return {
            'initial_capital': initial_capital,
            'final_capital': final_capital,
            'total_return': total_return,
            'max_drawdown': max_drawdown,
            'sharpe_ratio': sharpe_ratio,
            'trades': trades,
            'equity_curve': equity_curve
        }
    
    def _calculate_max_drawdown(self, strategy) -> float:
        """
        计算最大回撤
        """
        values = []
        for i, value in enumerate(strategy.broker.get_value_history()):
            values.append(value)
        
        if not values:
            return 0.0
        
        max_value = values[0]
        max_drawdown = 0.0
        
        for value in values:
            if value > max_value:
                max_value = value
            drawdown = (max_value - value) / max_value * 100
            if drawdown > max_drawdown:
                max_drawdown = drawdown
        
        return max_drawdown
    
    def _calculate_sharpe_ratio(self, strategy) -> float:
        """
        计算夏普比率（简化版）
        """
        # 这里使用简化的夏普比率计算
        # 实际应用中应该使用更复杂的计算方法
        returns = []
        prev_value = self.cerebro.broker.getcash()
        
        for value in strategy.broker.get_value_history():
            returns.append((value - prev_value) / prev_value)
            prev_value = value
        
        if not returns:
            return 0.0
        
        import numpy as np
        returns = np.array(returns)
        mean_return = np.mean(returns)
        std_return = np.std(returns)
        
        if std_return == 0:
            return 0.0
        
        # 假设无风险利率为0
        sharpe_ratio = mean_return / std_return * np.sqrt(252)
        
        return sharpe_ratio
    
    def _get_trades(self, strategy) -> List[Dict[str, Any]]:
        """
        获取交易记录
        """
        trades = []
        for trade in strategy.trades:
            trade_dict = {
                'date': trade.dt.isoformat(),
                'type': '买入' if trade.size > 0 else '卖出',
                'price': trade.price,
                'size': abs(trade.size),
                'pnl': trade.pnl
            }
            trades.append(trade_dict)
        
        return trades
    
    def _get_equity_curve(self) -> List[Tuple[str, float]]:
        """
        获取资金曲线
        """
        equity_curve = []
        if hasattr(self.cerebro, 'broker') and hasattr(self.cerebro.broker, 'get_value_history'):
            for dt, value in zip(self.cerebro.datas[0].datetime.array, self.cerebro.broker.get_value_history()):
                equity_curve.append((bt.num2date(dt).isoformat(), value))
        
        return equity_curve


class TestStrategy(bt.Strategy):
    """测试策略"""
    params = (
        ('fast_period', 10),
        ('slow_period', 20),
    )
    
    def __init__(self):
        self.fast_ma = bt.indicators.SimpleMovingAverage(
            self.data.close, period=self.params.fast_period
        )
        self.slow_ma = bt.indicators.SimpleMovingAverage(
            self.data.close, period=self.params.slow_period
        )
        self.crossover = bt.indicators.CrossOver(self.fast_ma, self.slow_ma)
    
    def next(self):
        if not self.position:
            if self.crossover > 0:
                self.buy(size=1)
        else:
            if self.crossover < 0:
                self.sell(size=1)
