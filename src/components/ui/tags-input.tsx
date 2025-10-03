
import React, { useState, KeyboardEvent, useRef } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}

const TagsInput = ({ 
  value = [],
  onChange,
  placeholder = "Type and press Tab to add...",
  className,
  id,
  name
}: TagsInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If Tab or Enter pressed and there's input value
    if ((e.key === "Tab" || e.key === "Enter") && inputValue.trim()) {
      e.preventDefault();
      
      const newTag = inputValue.trim();
      
      // Don't add duplicate tags
      if (!value.includes(newTag)) {
        const newTags = [...value, newTag];
        onChange(newTags);
      }
      
      setInputValue("");
    }
    
    // If Backspace pressed and no input value, remove the last tag
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      const newTags = value.slice(0, -1);
      onChange(newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`flex flex-wrap gap-2 p-2 min-h-10 border border-input bg-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${className}`}
      onClick={handleContainerClick}
    >
      {value.map((tag, index) => (
        <Badge 
          key={`${tag}-${index}`} 
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          {tag}
          <X 
            className="h-3 w-3 cursor-pointer hover:text-destructive" 
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
          />
        </Badge>
      ))}
      
      <Input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-w-[120px] h-6"
        placeholder={value.length === 0 ? placeholder : ""}
      />
    </div>
  );
};

export default TagsInput;
