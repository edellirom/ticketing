import useRequest from '../../hooks/use-request';
import Router from 'next/router';


const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders/',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  });
  return (<div>
    <h4>Ticket: <b>{ticket.title}</b></h4>
    <p>Price: {ticket.price} <b>$</b></p>
    <div className='pt-3'>
      {errors}
      <button onClick={() => doRequest()} className='btn btn-primary'>Purchase</button>
    </div>
  </div>);
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
