import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';


const CreateTicket = () => {

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (<div>
    <h1>Create a Ticket</h1>
    <section className='row'>
      <div className='col-4'>
        <form onSubmit={onSubmit}>
          <div className='mb-3'>
            <div className='form-group'>
              <label className='form-label'>Title</label>
              <input value={title} onChange={(event => setTitle(event.target.value))} className='form-control' />
            </div>
          </div>
          <div className='mb-3'>
            <div className='from-group'>
              <label className='form-label'>Price</label>
              <input
                value={price}
                onBlur={onBlur}
                onChange={event => setPrice(event.target.value)}
                className='form-control' />
            </div>
          </div>
          {errors}
          <button type='submit' className='btn btn-primary'>Submit</button>
        </form>
      </div>
    </section>

  </div>);
};

export default CreateTicket;
