import * as React from 'react';
import ReactEcharts from 'echarts-for-react';

interface IEchartProps {
  option: any;
}

const Echart = (props: IEchartProps) => {
  const { option } = props;
  return (
    <ReactEcharts
      option={option}
      style={{ height: '40vh' }}
      className="echart"
    />
  );
};

export default Echart;