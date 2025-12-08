import { useState, useRef } from 'react';
import { Send, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

/**
 * MessageInput Component
 * Input for typing and sending messages with file attachment support
 */
export const MessageInput = ({ onSend, isSending, disabled }) => {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setAttachment(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachmentPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachmentPreview(null);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = () => {
    if ((!message.trim() && !attachment) || isSending) return;

    onSend({
      message: message.trim(),
      attachment,
    });

    setMessage('');
    handleRemoveAttachment();
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="border-t bg-background p-4">
      {/* Attachment Preview */}
      {attachment && (
        <div className="mb-3 relative inline-block">
          {attachmentPreview ? (
            <div className="relative">
              <img 
                src={attachmentPreview} 
                alt="Preview" 
                className="max-h-32 rounded-lg border"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={handleRemoveAttachment}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 pr-3 rounded-lg border bg-muted">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(attachment.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 flex-shrink-0"
                onClick={handleRemoveAttachment}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
        />
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <Textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          className={cn(
            'flex-1 min-h-[44px] max-h-[150px] resize-none',
            'focus-visible:ring-1'
          )}
          rows={1}
        />

        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          disabled={(!message.trim() && !attachment) || disabled || isSending}
          className="flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* <p className="text-xs text-muted-foreground mt-2">
        Press Enter to send, Shift+Enter for new line
      </p> */}
    </div>
  );
};

export default MessageInput;
