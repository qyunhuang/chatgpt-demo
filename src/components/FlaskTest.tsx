import * as React from 'react';
import useAxios from 'axios-hooks';

const FlaskTest = () => {
  const [{ data }] = useAxios<any>({
    url: 'http://localhost:5000/users',
  });

  return (
    <>
      {data?.users.map((user: any, idx: number) => {
        return (
          <div key={idx}>
            <h1>{user}</h1>
          </div>
        );
      })}
    </>
  );
};

export default FlaskTest;