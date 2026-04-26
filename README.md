# FuturesPro 期货量化交易系统

AI 驱动的量化交易平台，涵盖实时交易、策略回测、AI信号识别、风控管理等核心功能。

## 项目文档

- [FuturesPro_实现方案_v1.0.html](./FuturesPro_实现方案_v1.0.html) - 完整实现方案（推荐在线查看）
- [FuturesPro_实现方案_v1.0.docx](./FuturesPro_实现方案_v1.0.docx) - Word 格式（需本地打开）
- [FuturesPro_实现方案_v1.0.pdf](./FuturesPro_实现方案_v1.0.pdf) - PDF 格式

## 技术栈

- **前端**: React 18 + TypeScript + Vite + Ant Design + ECharts + Tailwind CSS
- **后端**: Python 3.11 + FastAPI + SQLAlchemy + Celery + Redis
- **数据**: PostgreSQL 16 + TimescaleDB + Redis 7 + MinIO
- **量化**: Pandas + NumPy + TA-Lib + Backtrader + Scikit-learn
- **部署**: Docker + Nginx + GitHub Actions + Prometheus + Grafana

## 系统模块

| 模块 | 说明 |
|------|------|
| 仪表盘 | 账户资产总览、持仓状态、AI信号、市场动态 |
| 实时交易 | K线图表、下单交易、订单簿、持仓管理 |
| 回测系统 | 策略回测配置与执行、结果展示、风险分析 |
| 交易雷达 | AI智能扫描、信号检测、市场情绪分析 |
| 策略管理 | 策略CRUD、启停控制、AI优化建议 |
| 交易历史 | 历史记录查询、筛选导出、收益曲线 |
| 账户中心 | 用户信息、安全设置、API密钥、风控、订阅 |
