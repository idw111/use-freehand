# use-freehand

> react hook to use [perfect-freehand](https://github.com/steveruizok/perfect-freehand)

## usage

```typescript
const FreehandCanvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { capture, getRawData, reset } = useFreehand(canvasRef);
  return <canvas ref={canvasRef} width={600} height={400} />;
};
```

## API

- `capture: () => Promise<Blob>` captures the image on canvas
- `getRawData: () => number[][][]` returns arrays of points
- `reset: () => void` clears the canvas
