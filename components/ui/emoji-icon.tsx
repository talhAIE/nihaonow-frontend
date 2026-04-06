import React from "react";

type EmojiIconProps = {
  emoji: string;
  size?: number;
  className?: string;
};

export default function EmojiIcon({ emoji, size = 20, className }: EmojiIconProps) {
  return (
    <span
      className={className}
      style={{ fontSize: size, lineHeight: 1, display: "inline-flex", alignItems: "center" }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}
