import { useEffect, useState } from 'react';
import useRequest from '../../hooks/use-request';

const OrderList = ({ orders }) => {
  console.log(orders);
  return (<div>
    <h3>Orders list</h3>
    <ul>
      {orders.map(order => {
        return <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>;
      })}
    </ul>
  </div>);
};

OrderList.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  console.log(data);
  return { orders: data };
};
export default OrderList;
