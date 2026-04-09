import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

const CodeBlockComponent = ({ node, updateAttributes, extension }: NodeViewProps) => {
    const defaultLanguage = node.attrs.language || 'null'
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = () => {
        const codeContent = node.textContent
        navigator.clipboard.writeText(codeContent)
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 3000)
    }

    return (
        <NodeViewWrapper className="code-block font-playfair-display text-primary bg-gray-800 rounded-md p-2 w-full border-2 border-secondary">
            <div className="flex justify-between items-center">
                <select 
                    className="flex align-center justify-center bg-secondary text-white rounded-md px-2 custom-select" 
                    contentEditable={false} 
                    defaultValue={defaultLanguage} 
                    onChange={event => updateAttributes({ language: event.target.value })}
                >
                    <option value="null">
                        auto
                    </option>
                    <option className="text-white" disabled>
                        —
                    </option>
                    {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
                        <option key={index} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
                <button 
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-700 rounded-md transition-colors"
                    title={isCopied ? "Copied!" : "Copy code"}
                >
                    {isCopied ? (
                        <Check className="w-4 h-4 text-secondary" />
                    ) : (
                        <Copy className="w-4 h-4 text-secondary" />
                    )}
                </button>
            </div>
            <div className="relative">
                <pre className="overflow-x-auto">
                    <NodeViewContent as="code" className="text-white [&>*]:text-white" />
                </pre>
            </div>
        </NodeViewWrapper>
    )
}

export default CodeBlockComponent