import { Anchor, Code, Text, Title } from '@mantine/core';
import { MDXProvider } from '@mdx-js/react';
import type { MDXComponents } from 'mdx/types';
import type { FC, ReactNode } from 'react';

interface MarkdownProviderProps {
  children: ReactNode;
}

const mdxComponents: MDXComponents = {
  h1: (props) => <Title order={1} mb="md" {...props} />,
  h2: (props) => <Title order={2} mt="lg" mb="sm" {...props} />,
  h3: (props) => <Title order={3} mt="md" mb="xs" {...props} />,
  p: (props) => <Text mb="sm" {...props} />,
  code: (props) => <Code {...props} />,
  a: (props) => <Anchor {...props} />,
};

const MarkdownProvider: FC<MarkdownProviderProps> = ({ children }) => (
  <MDXProvider components={mdxComponents}>{children}</MDXProvider>
);

export default MarkdownProvider;
