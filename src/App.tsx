import clsx from "clsx";
import { CSSProperties, useCallback, useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="m-20">
      <div className="scale-90">
        <RippleImage />
      </div>
    </div>
  );
}

export default App;

const imgurl = "https://i.postimg.cc/66CVvCpH/hero-768.png";

function useQueue<T>() {
  const [queue, setQueue] = useState<T[]>([]);
  return {
    queue,
    push: useCallback((data: T) => setQueue((prev) => [...prev, data]), []),
    pop: useCallback(() => setQueue((x) => x.slice(1)), []),
  };
}

interface Pos {
  id: number;
  x: number;
  y: number;
}
function RippleImage() {
  const { queue, push, pop } = useQueue<Pos>();

  return (
    <div
      className="m-auto overflow-hidden relative"
      onClick={(e) => {
        const pos = {
          id: new Date().getTime(),
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
        };
        push(pos);
      }}
    >
      <img src={imgurl} draggable="false" alt="" />
      {queue.map(({ id, x, y }) => (
        <Ripple key={id} x={x} y={y} onEnd={pop} />
      ))}
    </div>
  );
}

function Ripple({ x, y, onEnd }: { x: number; y: number; onEnd?: () => void }) {
  return [
    { scale: 1.06, delay: 0 },
    { scale: 1.02, delay: 0.2 },
    { scale: 1.04, delay: 0.4 },
    { scale: 1.01, delay: 0.5 },
    { scale: 1.02, delay: 0.8 },
    { scale: 1, delay: 1 },
  ]
    .sort((a, b) => a.delay - b.delay) // ascending
    .map(({ scale, delay }, i, arr) => (
      <div
        key={i}
        style={
          {
            "--x": x + "px",
            "--y": y + "px",
            animationDelay: `${delay}s`,
          } as CSSProperties
        }
        className={clsx(
          "absolute left-0 top-0 right-0 bottom-0 pointer-events-none",
          "ripple"
        )}
        onAnimationEnd={() => {
          i === arr.length - 1 && onEnd?.();
        }}
      >
        <img
          src={imgurl}
          className="relative"
          style={
            {
              transform: `scale(${scale})`,
              zIndex: i,
            } as CSSProperties
          }
        />
      </div>
    ));
}
