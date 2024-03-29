// example code

import React, { FC, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useFreehand } from '../dist/esm/use-freehand';

const ExampleComponent: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { capture, reset } = useFreehand(canvasRef);
  return (
    <div style={{ padding: '120px 300px' }}>
      <canvas ref={canvasRef} width={600} height={400} style={{ border: 'solid 1px #ccc', marginTop: 100 }} />
    </div>
  );
};

window.onload = () => {
  const root = createRoot(document.querySelector('#root') as HTMLBodyElement);
  root.render(<ExampleComponent />);
};
