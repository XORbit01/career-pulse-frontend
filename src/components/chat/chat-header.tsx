
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  receiverName: string;
  displayName: string;
  onClose: () => void;
  showBackButton?: boolean;
}

const ChatHeader = ({ receiverName, displayName, onClose, showBackButton = false }: ChatHeaderProps) => {
  return (
    <div className="px-4 py-3 border-b border-border/30 bg-gradient-to-r from-background/80 to-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-6 w-6 p-0 mr-2 hover:bg-accent/50"
            >
              <ChevronLeft size={12} />
            </Button>
          )}
          <h3 className="text-sm font-medium">{displayName}</h3>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
