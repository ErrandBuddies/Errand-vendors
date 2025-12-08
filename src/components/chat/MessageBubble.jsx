import { useState } from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, Image as ImageIcon, FileText, Music, Video, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * Get icon for file type
 */
const getFileIcon = (type) => {
  switch (type) {
    case 'image':
      return ImageIcon;
    case 'video':
      return Video;
    case 'audio':
      return Music;
    default:
      return FileText;
  }
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * MessageBubble Component
 * Displays individual message with text, attachments, and status
 */
export const MessageBubble = ({ message, isSent }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const { message: text, attachment, timestamp, createdAt, status } = message;
  
  const time = timestamp || createdAt;
  const formattedTime = time ? format(new Date(time), 'HH:mm') : '';

  const renderAttachment = () => {
    if (!attachment) return null;

    const { type, url, name, size } = attachment;
    const FileIcon = getFileIcon(type);

    if (type === 'image' && url) {
      return (
        <>
          <div 
            className="relative rounded-lg overflow-hidden cursor-pointer max-w-xs mb-2"
            onClick={() => setShowImageModal(true)}
          >
            <img 
              src={url} 
              alt={name || 'Image'} 
              className="w-full h-auto max-h-64 object-cover"
            />
          </div>

          <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
            <DialogContent className="max-w-4xl">
              <DialogTitle className="sr-only">Image preview</DialogTitle>
              <img 
                src={url} 
                alt={name || 'Image'} 
                className="w-full h-auto"
              />
            </DialogContent>
          </Dialog>
        </>
      );
    }

    // Other file types (audio, video, documents)
    return (
      <a
        href={url}
        download={name}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border mb-2 hover:bg-accent transition-colors',
          isSent ? 'border-primary/30' : 'border-border'
        )}
      >
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          isSent ? 'bg-primary/10' : 'bg-muted'
        )}>
          <FileIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{name || 'File'}</p>
          {size && (
            <p className="text-xs text-muted-foreground">{formatFileSize(size)}</p>
          )}
        </div>
        <Download className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </a>
    );
  };

  const renderStatus = () => {
    if (!isSent) return null;

    if (status === 'sending') {
      return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />;
    }

    if (status === 'read') {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }

    if (status === 'delivered') {
      return <CheckCheck className="w-4 h-4" />;
    }

    return <Check className="w-4 h-4" />;
  };

  return (
    <div className={cn('flex mb-4', isSent ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[70%]')}>
        <div
          className={cn(
            'rounded-lg px-4 py-2',
            isSent
              ? 'bg-primary text-white'
              : 'bg-muted text-foreground'
          )}
        >
          {renderAttachment()}
          {text && <p className="text-sm whitespace-pre-wrap break-words">{text}</p>}
        </div>
        <div className={cn('flex items-center gap-1 mt-1 text-xs text-muted-foreground', isSent && 'justify-end')}>
          <span>{formattedTime}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
