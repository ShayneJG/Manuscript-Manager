import { Button } from '@chakra-ui/react';
import React from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

interface DataViewProps {
  labels: string[];
  view: number;
  setView: (view: number) => void;
}

export default function DataView({ labels, view, setView }: DataViewProps): JSX.Element {
  return (
    <div>
      {view !== 0 ? (
        <Button
          onClick={() => {
            setView(view - 1);
          }}
        >
          <AiOutlineArrowLeft />
        </Button>
      ) : null}
      <div>{labels[view]}</div>
      {view !== labels.length - 1 ? (
        <Button
          onClick={() => {
            setView(view + 1);
          }}
        >
          <AiOutlineArrowRight />
        </Button>
      ) : null}
    </div>
  );
}
