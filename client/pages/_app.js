import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <div className='row'>
          <Component currentUser={currentUser} {...pageProps} />
        </div>
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  let pageProps = {};

  try {
    const { data } = await client.get('/api/users/current-user');
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }
    return {
      pageProps,
      ...data
    };
  } catch (error) {
    console.error(error);
  }
  return pageProps;
};

export default AppComponent;
