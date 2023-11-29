# use-freehand

> react hook to use [perfect-freehand](https://github.com/steveruizok/perfect-freehand) with ease

## Install

`npm install --save use-freehand`

## Usage

```typescript
const FreehandCanvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { capture, getRawData, reset } = useFreehand(canvasRef);
  return <canvas ref={canvasRef} width={600} height={400} />;
};
```

[Live Demo](https://idw111.github.io/use-freehand/)

## API

```typescript
useFreehand: (canvasRef: RefObject<HTMLCanvasElement>, options?: StrokeOptions) => {
  capture: () => Promise<Blob>;
  getRawData: () => number[][][];
  reset: () => void;
};
```

- `capture: () => Promise<Blob>` captures the image on canvas
- `getRawData: () => number[][][]` returns arrays of points
- `reset: () => void` clears the canvas
