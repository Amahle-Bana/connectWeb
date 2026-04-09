import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { FacebookEmbed } from 'react-social-media-embed'

export default function FacebookComponent({ node }: NodeViewProps) {
    const url = node.attrs.url
  
    return (
      <NodeViewWrapper className='facebook-react-component flex justify-center items-center my-4'>
        <div className="max-w-[550px] w-full">
          <FacebookEmbed url={url} width={550} />
        </div>
      </NodeViewWrapper>
    )
} 