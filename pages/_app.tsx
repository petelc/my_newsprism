import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../utils/apolloClient';
import 'tailwindcss/tailwind.css';
import '../styles/global.css';

export default function App({ Component, pageProps }) {
    const apolloClient = useApollo(pageProps.useInitialApolloState);

    return (
        <ApolloProvider client={apolloClient}>
            <Component {...pageProps } />
        </ApolloProvider>
    );
    
}