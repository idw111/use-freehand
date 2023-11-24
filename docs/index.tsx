// example code

import React, { FC } from 'react';
import { createRoot } from 'react-dom/client';

const ExampleComponent: FC = () => {
  return <>Example</>;
};

window.onload = () => {
  const root = createRoot(document.querySelector('#root') as HTMLBodyElement);
  root.render(<ExampleComponent />);
};
