import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';

// Refer Writer Button Component
export default function ReferWriterButtonComponent(_props: NodeViewProps) {
  return (
    <NodeViewWrapper className="refer-writer-react-component flex justify-center items-center my-4">
      <Button
        className="flex flex-row items-center justify-around text-lg px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => console.log('refer writer')}
      >
        Refer Writer
        <UserPlus className="w-4 h-4 ml-2" />
      </Button>
    </NodeViewWrapper>
  );
} 