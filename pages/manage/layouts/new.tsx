import { FC } from 'react';
import Head from 'next/head';
import LayoutForm from '../../../src/components/LayoutForm';
import Page from '../../../src/components/PageFrame';
import { Box } from 'theme-ui';
// import Link from 'next/link';
import { HeadingFrame } from '../../../src/components/Card';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>New Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <HeadingFrame title="New Layout" />
        <Box>
          <LayoutForm />
        </Box>
      </Page>
    </>
  );
};

export default Index;