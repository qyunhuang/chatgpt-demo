import * as React from 'react';
// import useAxios from 'axios-hooks';
import { selectUsers } from '../utils/request'

const FlaskTest = () => {
  // const [{ data }] = useAxios<any>({
  //   url: 'http://localhost:5000/api/users',
  //   method: 'post',
  //   data: {
  //     user_id: 1,
  //   }
  // });
  const [users, setUsers] = React.useState<any[]>([]);

  React.useEffect(() => {
    selectUsers(1)
    .then((res: any) => {
      console.log(res);
      setUsers(res.data.users);
    });
  }, []);

  return (
    <>
      {users.map((user: any, idx: number) => {
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