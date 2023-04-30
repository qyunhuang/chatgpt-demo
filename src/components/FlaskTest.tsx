import * as React from 'react';
import useAxios from 'axios-hooks';

const FlaskTest = () => {
  const [{ data }] = useAxios<any>({
    url: 'http://localhost:5000/users',
  });

  return (
    <>
      <h1>{data?.users[0]}</h1>
    </>
  );
};

export default FlaskTest;