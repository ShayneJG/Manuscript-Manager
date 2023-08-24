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
    <div className='flex'>
      
        <Button isDisabled={view === 0}
          onClick={() => {
            setView(view - 1);
          }}
        >
          <AiOutlineArrowLeft />
        </Button>
      
      <div>{labels[view]}</div>
      
        <Button isDisabled={view === labels.length - 1}
          onClick={() => {
            setView(view + 1);
          }}
        >
          <AiOutlineArrowRight />
        </Button>
      
    </div>
  );
}
