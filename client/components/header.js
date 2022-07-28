import Link from 'next/link';

export default ({ currentUser }) => {
  const authorisedUserLinks = [
    { label: 'Create ticket', href: '/tickets/create' },
    { label: 'Orders', href: '/orders' },
    { label: 'Sign Out', href: '/auth/signout' }
  ];
  const unauthorisedUserLinks = [
    { label: 'Sign Up', href: '/auth/signup' },
    { label: 'Sign In', href: '/auth/signin' }
  ];
  const currentLinks = currentUser ? authorisedUserLinks : unauthorisedUserLinks;
  const links = currentLinks.map(({ label, href }) => {
    return (
      <li key={href} className='nav-item'>
        <Link href={href}>
          <a className='nav-link'>{label}</a>
        </Link>
      </li>
    );
  });

  return (
    <nav className='navbar navbar-light bg-light'>
      <div className='container'>
        <Link href='/'>
          <a className='navbar-brand'>GitTix</a>
        </Link>

        <div className='d-flex justify-content-end'>
          <ul className='nav d-flex align-items-center'>{links}</ul>
        </div>
      </div>
    </nav>
  );
};
