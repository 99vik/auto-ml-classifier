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
    // console.log(allPositions);
    setPositions(allPositions);
    // console.log(allPositions);
    // console.log(ref1.current.children[0].offsetLeft);
    // console.log(ref1.current.children[0].offsetTop);
    // console.log(ref2.current.children[0].getBoundingClientRect());
  }, []);

  function drawLines() {
    console.log(positions);
    const lines = positions.map((layer, index) => {
      if (index === positions.length - 1) {
        return null;
      }
      const layerLines = layer.map(
        (neuron: { x: number; y: number }, index2: number) => {
          const neuronLines = positions[index + 1].map(
            (nextNeuron: { x: number; y: number }) => {
              return (
                <line
                  key={`${index}-${index2}`}
                  x1={neuron.x + 20}
                  y1={neuron.y + 20}
                  x2={nextNeuron.x + 20}
                  y2={nextNeuron.y + 20}
                  stroke="black"
                  strokeWidth={1}
                />
              );
            },
          );
          return neuronLines;
        },
      );
      return layerLines;
    });
    // console.log(positions);
    return lines;
  }

  return (
    <div ref={ref} className="relative flex h-[400px] justify-evenly">
      <svg className="absolute h-full w-full">
        {positions.length > 0 && drawLines()}
      </svg>
      <div className="flex flex-col justify-evenly">
        <div className="z-10 size-10 rounded-full bg-primary" />
        <div className="z-10 size-10 rounded-full bg-primary" />
      </div>

      <div className="flex flex-col justify-evenly">
        <div className="z-10 size-10 rounded-full bg-primary" />
      </div>
    </div>
  );
}
