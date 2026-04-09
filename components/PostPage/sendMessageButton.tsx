import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';

// Send Message Button Component
export default function SendMessageButtonComponent(_props: NodeViewProps) {
  return (
    <NodeViewWrapper className="send-message-react-component flex justify-center items-center my-4">
      <Button
        className="flex flex-row items-center justify-around text-lg px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => console.log('send message')}
      >
        Send Message
        <Send className="w-4 h-4 ml-2" />
      </Button>
    </NodeViewWrapper>
  );
} 