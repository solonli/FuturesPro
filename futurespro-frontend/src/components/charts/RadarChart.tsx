import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RadarChartProps {
  data: any[];
  indicators: any[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data, indicators }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chartInstance: echarts.ECharts | null = null;

  useEffect(() => {
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      const option = {
        backgroundColor: '#1a1a2e',
        tooltip: {},
        radar: {
          indicator: indicators,
          shape: 'circle',
          splitNumber: 5,
          axisName: {
            color: '#a0a0b0'
          },
          splitLine: {
            lineStyle: {
              color: ['#4a4a6a', '#4a4a6a', '#4a4a6a', '#4a4a6a', '#4a4a6a']
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(74, 74, 106, 0.1)', 'rgba(74, 74, 106, 0.2)', 'rgba(74, 74, 106, 0.3)', 'rgba(74, 74, 106, 0.4)', 'rgba(74, 74, 106, 0.5)']
            }
          },
          axisLine: {
            lineStyle: {
              color: '#4a4a6a'
            }
          }
        },
        series: [
          {
            name: '雷达图',
            type: 'radar',
            data: data
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
  }, [data, indicators]);

  return (
    <div className="w-full h-64 bg-dark-300 rounded-lg border border-gray-700">
      <div ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default RadarChart;