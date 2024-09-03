"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function NeuralNetworkArchitecture({
  hiddenLayers,
  setHiddenLayers,
  numberOfInputs,
  numberOfOutputs,
}: {
  hiddenLayers: number[];
  setHiddenLayers: (hiddenLayers: number[]) => void;
  numberOfInputs: number;
  numberOfOutputs: number;
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
    const resizeObeserver = new ResizeObserver(setAllPositions);
    resizeObeserver.observe(ref.current?.parentNode as HTMLElement);

    return () => resizeObeserver.disconnect();
  }, [hiddenLayers, numberOfOutputs]);

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
        <div className="whitespace-nowrap text-center text-sm text-muted-foreground">
          <p>Input layer</p>
          <p className="text-xs">({numberOfInputs} neurons)</p>
        </div>
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
                disabled={hiddenLayers[layerIndex] === 30}
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
        <div className="whitespace-nowrap text-center text-sm text-muted-foreground">
          <p>Output layer</p>
          <p className="text-xs">({numberOfOutputs} neurons)</p>
        </div>
      </div>
      <div ref={ref} className="relative mt-6 flex justify-evenly">
        <svg className="absolute h-full w-full">
          {positions.length > 0 && drawLines()}
        </svg>
        <div className="flex flex-col justify-evenly gap-4">
          {numberOfInputs <= 10
            ? [...Array(numberOfInputs)].map((_, neuronIndex) => (
                <div
                  key={`outputLayer-${neuronIndex}`}
                  className="z-10 size-10 rounded-full bg-primary"
                />
              ))
            : [...Array(11)].map((_, neuronIndex) => {
                if (neuronIndex === 5) {
                  return (
                    <section
                      className="flex flex-col items-center justify-center gap-1"
                      key={`outputLayer-${neuronIndex}`}
                    >
                      <div className="size-2 rounded-full bg-muted-foreground" />
                      <div className="size-2 rounded-full bg-muted-foreground" />
                      <div className="size-2 rounded-full bg-muted-foreground" />
                    </section>
                  );
                } else {
                  return (
                    <div
                      key={`outputLayer-${neuronIndex}`}
                      className="z-10 size-10 rounded-full bg-primary"
                    />
                  );
                }
              })}
        </div>
        {hiddenLayers.map((neurons, layerIndex) => (
          <div key={layerIndex} className="flex flex-col justify-evenly gap-4">
            {neurons <= 10
              ? [...Array(neurons)].map((_, neuronIndex) => (
                  <div
                    key={`${layerIndex}-${neuronIndex}`}
                    className="z-10 size-10 rounded-full bg-primary"
                  />
                ))
              : // [...Array(11)].map((_, neuronIndex) => (
                //     <div
                //       key={`${layerIndex}-${neuronIndex}`}
                //       className="z-10 size-10 rounded-full bg-primary"
                //     />
                // ))
                [...Array(11)].map((_, neuronIndex) => {
                  if (neuronIndex === 5) {
                    return (
                      <section
                        className="flex flex-col items-center justify-center gap-1"
                        key={`${layerIndex}-${neuronIndex}`}
                      >
                        <div className="size-2 rounded-full bg-muted-foreground" />
                        <div className="size-2 rounded-full bg-muted-foreground" />
                        <div className="size-2 rounded-full bg-muted-foreground" />
                      </section>
                    );
                  } else {
                    return (
                      <div
                        key={`${layerIndex}-${neuronIndex}`}
                        className="z-10 size-10 rounded-full bg-primary"
                      />
                    );
                  }
                })}
          </div>
        ))}

        <div className="flex flex-col justify-evenly gap-4">
          {numberOfOutputs <= 10
            ? [...Array(numberOfOutputs)].map((_, neuronIndex) => (
                <div
                  key={`outputLayer-${neuronIndex}`}
                  className="z-10 size-10 rounded-full bg-primary"
                />
              ))
            : [...Array(11)].map((_, neuronIndex) => {
                if (neuronIndex === 5) {
                  return (
                    <section
                      className="flex flex-col items-center justify-center gap-1"
                      key={`outputLayer-${neuronIndex}`}
                    >
                      <div className="size-2 rounded-full bg-muted-foreground" />
                      <div className="size-2 rounded-full bg-muted-foreground" />
                      <div className="size-2 rounded-full bg-muted-foreground" />
                    </section>
                  );
                } else {
                  return (
                    <div
                      key={`outputLayer-${neuronIndex}`}
                      className="z-10 size-10 rounded-full bg-primary"
                    />
                  );
                }
              })}
        </div>
      </div>
    </>
  );
}
