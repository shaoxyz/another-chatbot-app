import React, { useEffect, useRef, ReactNode } from "react";
import { ScrollArea } from "@radix-ui/themes";
interface Props {
  children: ReactNode;
}
const AutoScrollToBottom = ({ children, ...props }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current;
      // 设置滚动位置到最大滚动高度
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [children]); // 依赖于 children 的变化来触发效果

  return (
    <ScrollArea ref={scrollRef} {...props}>
      {children}
    </ScrollArea>
  );
};

export default AutoScrollToBottom;
