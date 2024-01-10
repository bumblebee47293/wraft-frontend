import type { Theme } from 'theme-ui';

const text: Theme['text'] = {
  error: {
    variant: 'text.subR',
    color: 'red.600',
  },
  pR: {
    color: 'gray.500',
    fontSize: 2,
    fontWeight: 400,
    lineHeight: '1.6',
  },
  pM: {
    color: 'text',
    fontSize: 2,
    fontWeight: 500,
    lineHeight: '1.6',
  },
  pB: {
    color: 'text',
    fontSize: 2,
    fontWeight: 700,
    lineHeight: '1.6',
  },
  subR: {
    color: 'gray.500',
    fontSize: 1,
    fontWeight: 400,
    lineHeight: '1.6',
  },
  subM: {
    color: 'gray.500',
    fontSize: 1,
    fontWeight: 400,
    lineHeight: '1.6',
  },
  capM: {
    color: 'gray.500',
    fontSize: 1,
    fontWeight: 500,
    lineHeight: '1.6',
  },
  labelSmall: {
    pl: 1,
    pr: 2,
    mr: 3,
    fontSize: 0,
    fontWeight: 400,
    color: 'text',
    display: 'inline-block',
    textAlign: 'right',
    width: 'auto',
    textTransform: 'uppercase',
    letterSpacing: '-0.01rem',
  },
  labelcaps: {
    fontWeight: 300,
    color: 'text',
    letterSpacing: '0.2px',
    textTransform: 'uppercase',
    fontSize: '10.24px',
  },
  sectionheading: {
    fontWeight: 300,
    fontSize: 1,
    lineHeight: '24px',
    pb: 2,
  },
  caps: {
    pt: 0,
    pb: 1,
    color: 'text',
    fontSize: 0,
    textTransform: 'uppercase',
  },
  menulink: {
    fontSize: 3,
    fontWeight: 600,
  },
  pagetitle: {
    fontSize: 4,
    mb: 3,
    fontWeight: 300,
  },
  pageinfo: {
    color: 'text',
    fontWeight: 300,
  },
  pagedesc: {
    fontSize: 1,
    mb: 4,
    color: 'text',
  },
  pageheading: {
    fontSize: 1,
    mb: 2,
    color: 'text',
    fontWeight: 400,
    mt: 2,
  },
  personName: {
    fontSize: 1,
    fontWeight: 'heading',
    mb: 0,
  },
  personBio: {
    fontSize: 1,
    mb: 0,
    fontWeight: 'body',
    color: 'text',
  },
  personBlock: {
    color: 'text',
    fontSize: 0,
    fontWeight: 'heading',
  },
  personPlace: {
    fontSize: 0,
    mt: 0,
    color: 'gray.500',
  },
};

export default text;