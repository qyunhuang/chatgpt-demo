import * as React from 'react';
import ReactEcharts from 'echarts-for-react';

interface IEchartProps {
  option: any;
}

const Echart = (props: IEchartProps) => {
  const { option } = props;

  const echartsOption = (code: string): null | object => {
    if (!code.split('option = ')[1]) {
      return null;
    }

    const option = code.split('option = ')[1]
      .replace(/\/\/.*$/gm, '')  // remove comments
      .replace(/(\b\w+\b)(?=:)/g, '"$1"')  // add double quotes to keys
      .replace(/'/g, '"')  // replace single quotes with double quotes
      .replace(/\n/g, "")  // remove \n
      .replace(/[^\S\r\n]/g, '')  // remove whitespace
      .replace(/;/g, "");  // remove ;

    if (!option.match(/^{.*}$/)) {
      return null;
    }

    return JSON.parse(option);
  }

  const formatOption = echartsOption(option);

  return (
    formatOption ? <ReactEcharts
      option={formatOption}
      style={{ height: '40vh' }}
      className="echart"
    /> : null
  );
};

export default Echart;
