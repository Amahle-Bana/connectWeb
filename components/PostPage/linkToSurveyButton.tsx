import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { Button } from '../ui/button';
import { Link } from 'lucide-react';

// Link To Survey Button Component
export default function LinkToSurveyButtonComponent(_props: NodeViewProps) {
  return (
    <NodeViewWrapper className="link-to-survey-react-component flex justify-center items-center my-4">
      <Button
        className="flex flex-row items-center justify-around text-lg px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => console.log('link to survey')}
      >
        Link To Survey
        <Link className="w-4 h-4 ml-2" />
      </Button>
    </NodeViewWrapper>
  );
} 