import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className='col-6'>
      <form onSubmit={onSubmit}>
        <h3>Sign In</h3>
        <hr />
        <div className='mb-3'>
          <div className='form-group'>
            <label>Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='form-control'
            />
          </div>
        </div>
        <div className='mb-3'>
          <div className='form-group'>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              className='form-control'
            />
          </div>
        </div>
        {errors}
        <button className='btn btn-primary'>Sign In</button>
      </form>
    </div>
  );
};
