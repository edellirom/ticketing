import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  if (!tickets)
    return (<div></div>);

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a className='nav-link'>{ticket.title}</a>
          </Link>
        </td>
        <td>{ticket.price}</td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
        </tr>
        </thead>
        <tbody>
        {ticketList}
        </tbody>
      </table>
    </div>
  );

};

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
