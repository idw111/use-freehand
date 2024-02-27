import getStroke, { StrokeOptions } from 'perfect-freehand';
import { MouseEvent, RefObject, useEffect, useRef } from 'react';

const average = (a: number, b: number) => (a + b) / 2;

const getSvgPathFromStroke = (points: number[][], closed = true): string => {
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a = points[0];
  let b = points[1];
  const c = points[2];

  // prettier-ignore
  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(2)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(b[1], c[1]).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(2)} `;
  }

  if (closed) {
    result += 'Z';
  }

  return result;
};

const defaultOptions: StrokeOptions = { size: 8, thinning: 0.8 };

export const useFreehand = (
  canvasRef: RefObject<HTMLCanvasElement>,
  options?: StrokeOptions
): {
  reset: () => void;
  capture: () => Promise<Blob>;
  getRawData: () => number[][][];
} => {
  const mouseStateRef = useRef<'down' | 'up'>('up');
  const pointsRef = useRef<number[][][]>([]);
  const handleMouseDown = () => {
    mouseStateRef.current = 'down';
    pointsRef.current.push([]);
  };
  const handleMouseUp = () => {
    mouseStateRef.current = 'up';
  };
  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (mouseStateRef.current === 'up') return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = rect.x;
    const offsetY = rect.y;
    const lastPoints = pointsRef.current[pointsRef.current.length - 1];
    if (e.type === 'mousemove') {
      console.log(e.type, (e as MouseEvent).clientX - offsetX, (e as MouseEvent).clientY - offsetY);
      lastPoints.push([(e as MouseEvent).clientX - offsetX, (e as MouseEvent).clientY - offsetY]);
    } else {
      console.log(e.type, (e as TouchEvent).touches[0].clientX - offsetX, (e as TouchEvent).touches[0].clientY - offsetY);
      lastPoints.push([(e as TouchEvent).touches[0].clientX - offsetX, (e as TouchEvent).touches[0].clientY - offsetY]);
    }

    const ctx = canvasRef.current.getContext('2d');
    const strokes = getStroke(lastPoints, { ...defaultOptions, ...options });
    const path = getSvgPathFromStroke(strokes);
    const myPath = new Path2D(path);

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.fill(myPath);
  };

  const handleRegisterEventListener = (): any => {
    if (!canvasRef.current) return setTimeout(handleRegisterEventListener, 200);

    const parent = canvasRef.current.parentElement;
    if (parent.style.overflow !== 'hidden') console.warn("canvas parent overflow should be 'hidden'");
    if (parent.style.touchAction !== 'none') console.warn("canvas parent touchAction should be 'none'");

    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    canvasRef.current.addEventListener('mousemove', handleMouseMove.bind(this));
    canvasRef.current.addEventListener('mouseup', handleMouseUp);

    canvasRef.current.addEventListener('touchstart', handleMouseDown);
    canvasRef.current.addEventListener('touchmove', handleMouseMove.bind(this));
    canvasRef.current.addEventListener('touchend', handleMouseUp);
  };

  const handleUnregisterEventListener = () => {
    if (!canvasRef.current) return;

    canvasRef.current.removeEventListener('mousedown', handleMouseDown);
    canvasRef.current.removeEventListener('mousemove', handleMouseMove.bind(this));
    canvasRef.current.removeEventListener('mouseup', handleMouseUp);

    canvasRef.current.removeEventListener('touchstart', handleMouseDown);
    canvasRef.current.removeEventListener('touchmove', handleMouseMove.bind(this));
    canvasRef.current.removeEventListener('touchend', handleMouseUp);
  };

  const reset = (): void => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    pointsRef.current = [];
  };

  const capture = async (): Promise<Blob> => {
    if (!canvasRef.current) return;
    const minX = Math.min(...pointsRef.current.map((points) => Math.min(...points.map((p) => p[0]))));
    const minY = Math.min(...pointsRef.current.map((points) => Math.min(...points.map((p) => p[1]))));
    const maxX = Math.max(...pointsRef.current.map((points) => Math.max(...points.map((p) => p[0]))));
    const maxY = Math.max(...pointsRef.current.map((points) => Math.max(...points.map((p) => p[1]))));
    const width = maxX - minX;
    const height = maxY - minY;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(canvasRef.current, minX, minY, width, height, 0, 0, width, height);
    const blob: Blob = await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png', 1));
    return blob;
  };

  const getRawData = (): number[][][] => {
    return pointsRef.current;
  };

  useEffect(() => {
    if (canvasRef.current) {
      handleRegisterEventListener();
      return handleUnregisterEventListener;
    }
  }, []);

  return { reset, capture, getRawData };
};
