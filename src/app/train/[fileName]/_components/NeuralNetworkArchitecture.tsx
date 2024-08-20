"use client";

import { useEffect, useRef, useState } from "react";

export default function NeuralNetworkArchitecture() {
  const ref = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    // ref!.current!.children.forEach((child, index) => {
    //   console.log(child.offsetLeft);
    //   console.log(child.offsetTop);
    // });
    const layers = Array.from(ref.current!.children);
    layers.shift();
    const allPositions = layers.map((layer) => {
      const children = Array.from(layer.children) as HTMLDivElement[];
      const positions = children.map((child) => {
        return {
          x: child.offsetLeft,
          y: child.offsetTop,
        };
      });
      return positions;
    });
    console.log(allPositions);
    // console.log(ref1.current.children[0].offsetLeft);
    // console.log(ref1.current.children[0].offsetTop);
    // console.log(ref2.current.children[0].getBoundingClientRect());
  }, []);

  function drawLines() {
    const lines = positions.map((positions, index) => {});
    return <line x1="276px" y1="127px" x2="75%" y2="25%" stroke="gray" />;
  }

  return (
    <div ref={ref} className="relative flex h-[400px] justify-evenly">
      <svg className="absolute h-full w-full">{drawLines()}</svg>
      <div className="flex flex-col justify-evenly">
        <div className="size-10 rounded-full bg-blue-500" />
        <div className="size-10 rounded-full bg-blue-500" />
      </div>

      <div className="flex flex-col justify-evenly">
        <div className="size-10 rounded-full bg-blue-500" />
      </div>
    </div>
  );
}
