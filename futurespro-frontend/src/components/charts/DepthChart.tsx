import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface DepthChartProps {
  buyData: any[];
  sellData: any[];
}

const DepthChart: React.FC<DepthChartProps> = ({ buyData, sellData }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chartInstance: echarts.ECharts | null = null;

  useEffect(() => {
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      const option = {
        backgroundColor: '#1a1a2e',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#4a4a6a'
            }
          },
          axisLabel: {
            color: '#a0a0b0'
          },
          splitLine: {
            lineStyle: {
              color: '#2a2a4a'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: buyData.map(item => item[0]).concat(sellData.map(item => item[0])),
          axisLine: {
            lineStyle: {
              color: '#4a4a6a'
            }
          },
          axisLabel: {
            color: '#a0a0b0'
          },
          splitLine: {
            lineStyle: {
              color: '#2a2a4a'
            }
          }
        },
        series: [
          {
            name: '买单',
            type: 'bar',
            data: buyData.map(item => item[1]),
            itemStyle: {
              color: '#00D4FF'
            }
          },
          {
            name: '卖单',
            type: 'bar',
            data: sellData.map(item => item[1]),
            itemStyle: {
              color: '#6366F1'
            }
          }
        ]
      };

      chartInstance.setOption(option);

      const handleResize = () => {
        chartInstance?.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance?.dispose();
      };
    }
  }, [buyData, sellData]);

  return (
    <div className="w-full h-64 bg-dark-300 rounded-lg border border-gray-700">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default DepthChart;