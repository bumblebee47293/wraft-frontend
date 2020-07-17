import React from 'react';
import Head from 'next/head';
import { Box, Flex } from 'rebass';

import { useStoreState } from 'easy-peasy';
import Container from './Container';
import Sidebar from './Sidebar';
import Nav from './Nav';
// import { Close } from 'theme-ui';

// import { ToastProvider } from 'react-toast-notifications';

export interface IPage {
  showFull?: boolean;
  children: any;
  id?: string;
}

export interface IAlert {
  appearance?: any;
  children: any;
}

// const AlertBlock = (props: IAlert) => {
//   console.log('props AlertBlock', props);
//   return (
//     <Box bg="primary">
//       X{props.children}
//       <Close ml="auto" mr={-2} />
//     </Box>
//   );
// };

export const Page = (props: IPage) => {
  const showFull: boolean = props && props.showFull ? true : false;
  const token = useStoreState(state => state.auth.token);
  return (
    <>
      <Head>
        <title>Wraft Docs</title>
        <meta
          name="keywords"
          content="document,automation,proposals,sales,hr,contract management"
        />
        <meta
          name="description"
          content="Wraft Docs help busines move steady and fast with Document Automation System"
        />
      </Head>
      {/* <ToastProvider> */}
        <Container width={100} bg={''}>
          {!token && (
            <Box>
              <Nav />
              <Box color="#333">{props.children}</Box>
            </Box>
          )}
          {token && (
            <Flex>
              <Sidebar showFull={showFull} />
              <Box width={1}>
                <Nav />
                <Box
                  sx={{ minHeight: '100vh' }}
                  bg="quaternary"
                  color="#333"
                  width={1}
                  p={4}
                  pt={3}
                  pl={8}>
                  {props.children}
                </Box>
              </Box>
            </Flex>
          )}
        </Container>
      {/* </ToastProvider> */}
    </>
  );
};

export default Page;
