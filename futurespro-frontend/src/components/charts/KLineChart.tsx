import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface KLineChartProps {
  data: any[];
}

const KLineChart: React.FC<KLineChartProps> = ({ data }) => {
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
          type: 'category',
          data: data.map(item => item[0]),
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#4a4a6a'
            }
          },
          axisLabel: {
            color: '#a0a0b0'
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
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
            name: 'K线',
            type: 'candlestick',
            data: data.map(item => [item[1], item[4], item[3], item[2]]),
            itemStyle: {
              color: '#00D4FF',
              color0: '#6366F1',
              borderColor: '#00D4FF',
              borderColor0: '#6366F1'
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
  }, [data]);

  return (
    <div className="w-full h-96 bg-dark-300 rounded-lg border border-gray-700">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default KLineChart;