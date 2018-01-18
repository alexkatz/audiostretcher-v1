import * as React from 'react';

const KeySnippet = ({ children }) => (
  <span
    style={{
      fontSize: 14,
      fontFamily: 'monospace',
      fontWeight: 'bolder',
    }}
  >
    {children}
  </span>
);

export { KeySnippet };
