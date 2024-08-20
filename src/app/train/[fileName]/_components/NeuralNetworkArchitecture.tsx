"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function NeuralNetworkArchitecture({
  hiddenLayers,
  setHiddenLayers,
}: {
  hiddenLayers: number[];
  setHiddenLayers: (hiddenLayers: number[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    function setAllPositions() {
      const layers = Array.from(ref.current!.children);
      layers.shift();
      const allPositions = layers.map((layer) => {
        const children = Array.from(layer.children) as HTMLDivElement[];
        const positionsFiltered = children.filter(
          (child) => child.tagName === "DIV",
        );
        const positions = positionsFiltered.map((child) => {
          return {
            x: child.offsetLeft,
            y: child.offsetTop,
          };
        });

        return positions;
      });
      setPositions(allPositions);
    }
    setAllPositions();
    window.addEventListener("resize", setAllPositions);
  }, [hiddenLayers]);

  function drawLines() {
    const lines = positions.map((layer, layerIndex) => {
      if (layerIndex === positions.length - 1) {
        return null;
      }
      const layerLines = layer.map(
        (neuron: { x: number; y: number }, neuronIndex: number) => {
          const neuronLines = positions[layerIndex + 1].map(
            (nextNeuron: { x: number; y: number }, nextNeuronIndex: number) => {
              return (
                <line
                  key={`${layerIndex}-${neuronIndex}-${nextNeuronIndex}`}
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
    return lines;
  }

  return (
    <>
      <div className="mt-5 flex items-center justify-evenly">
        <p className="whitespace-nowrap text-sm text-muted-foreground">
          Input layer
        </p>
        {hiddenLayers.map((neurons, layerIndex) => (
          <div key={layerIndex} className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-1">
              <Button
                disabled={hiddenLayers[layerIndex] === 1}
                variant="outline"
                size="sm"
                className="aspect-square h-fit rounded-full px-1.5"
                onClick={() => {
                  const newHiddenLayers = [...hiddenLayers];
                  newHiddenLayers[layerIndex]--;
                  setHiddenLayers(newHiddenLayers);
                }}
              >
                <Minus size={14} strokeWidth={2} />
              </Button>
              <Button
                disabled={hiddenLayers[layerIndex] === 10}
                onClick={() => {
                  const newHiddenLayers = [...hiddenLayers];
                  newHiddenLayers[layerIndex]++;
                  setHiddenLayers(newHiddenLayers);
                }}
                variant="outline"
                size="sm"
                className="aspect-square h-fit rounded-full px-1.5"
              >
                <Plus size={14} strokeWidth={2} />
              </Button>
            </div>
            <p className="whitespace-nowrap text-sm">{neurons} neurons</p>
          </div>
        ))}
        <p className="whitespace-nowrap text-sm text-muted-foreground">
          Output layer
        </p>
      </div>
      <div ref={ref} className="relative mt-6 flex justify-evenly">
        <svg className="absolute h-full w-full">
          {positions.length > 0 && drawLines()}
        </svg>
        <div className="flex flex-col justify-evenly gap-10">
          <div className="z-10 size-10 rounded-full bg-primary" />
          <div className="z-10 size-10 rounded-full bg-primary" />
        </div>
        {hiddenLayers.map((neurons, layerIndex) => (
          <div key={layerIndex} className="flex flex-col justify-evenly gap-10">
            {[...Array(neurons)].map((_, neuronIndex) => (
              <div
                key={`${layerIndex}-${neuronIndex}`}
                className="z-10 size-10 rounded-full bg-primary"
              />
            ))}
          </div>
        ))}
        <div className="flex flex-col justify-evenly gap-10">
          <div className="z-10 size-10 rounded-full bg-primary" />
        </div>
      </div>
    </>
  );
}
