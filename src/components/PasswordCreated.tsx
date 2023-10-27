// import Image from 'next/image';
import { Flex, Box, Heading, Button, Link, Text } from 'theme-ui';
import CheckSuccess from '../../public/check-success.svg';

const PasswordCreated = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '80px' }}>
      <Flex
        variant="onboardingForms"
        sx={{
          alignItems: 'center',
          p: '0px',
          pt: '78px',
          px: '86px',
        }}>
        <Heading
          variant="styles.h3Mediun"
          sx={{ mb: '64px', color: 'dark_900' }}>
          Password Created
        </Heading>
        <img src={CheckSuccess} alt="" className="" />
        <Text sx={{ my: '40px', color: 'dark_400', fontWeight: 'heading' }}>
          Awesome! You are ready to access your Wraft account Login your account
          and enjoy your workplace
        </Text>
        <Link href="/login">
          <Button>Go to login page</Button>
        </Link>
      </Flex>
    </Box>
  );
};

export default PasswordCreated;
