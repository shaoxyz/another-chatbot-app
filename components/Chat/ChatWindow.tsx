"use client";
import { useState } from "react";
import { decrypt } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import {
  Card,
  Text,
  Flex,
  Avatar,
  TextField,
  Separator,
  Button,
  AlertDialog,
  Badge,
} from "@radix-ui/themes";

import { IconShare, IconSpinner } from "@/components/ui/icons";
import AutoScrollToBottom from "@/components/auto-scroll-area";
export default function Chat() {
  interface Msg {
    role: string;
    content: string;
    score?: number;
  }

  const { gender, setGender } = useUser();
  const firstMsg: Msg = { role: "ai", content: "你饿不饿，我给你带了好吃的" };
  const [msgs, setMsgs] = useState<Msg[]>([firstMsg]);
  const [userInput, setUserInput] =
    useState<string>("别再纠缠我了！我不喜欢你！");
  const [love, setLove] = useState<number>(100);
  const [sendCountDown, setSendCountDown] = useState<number>(8);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const call_ai = async (msg: Msg) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gender, follow_msgs: [...msgs.slice(1), msg] }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const key = response.headers.get("iv");
      const encrypted = await response.text();
      const { ai_msg, ai_score } = await decrypt(key!, encrypted);
      return { ai_msg, ai_score };
    } catch (error) {
      console.error("There was an error!", error);
      return { ai_msg: "哼...", ai_score: -10 };
    }
  };

  const send = async () => {
    if (!!!userInput.trim() || loading || love < 1) {
      return;
    }
    if (sendCountDown === 0) {
      setIsAlertOpen(true);
    } else {
      await send_msg();
    }
  };

  const send_msg = async () => {
    setLoading(true);
    const msg: Msg = { role: "user", content: userInput };
    const typing: Msg = { role: "ai", content: "Typing..." };
    setMsgs([...msgs, msg, typing]);
    setUserInput("");
    setSendCountDown(sendCountDown - 1);

    // @ts-ignore
    const { ai_msg, ai_score } = await call_ai(msg);

    // after ai response
    setMsgs((prevMsgs) => {
      const newMsgs = [...prevMsgs];
      newMsgs[newMsgs.length - 1] = {
        role: "ai",
        content: ai_msg,
        score: ai_score,
      };
      return newMsgs;
    });
    const new_score = love + ai_score;
    setLove(new_score);
    setLoading(false);
    if (new_score < 1) {
      setIsAlertOpen(true);
    }
  };

  const MessageLine = ({ msg }: { msg: Msg }) => {
    const badgeColor = msg.score! > 0 ? "red" : "green";
    if (msg.role === "ai") {
      return (
        <Text size="2" weight="bold" className="p-4">
          {msg.content === "Typing..." ? (
            <IconSpinner className="inline" />
          ) : (
            msg.content
          )}
          {msg.score === undefined ? null : (
            <Badge color={badgeColor}>爱意：{msg.score}</Badge>
          )}
        </Text>
      );
    }
    return (
      <Text size="2" weight="bold" className="p-4">
        {msg.content}
      </Text>
    );
  };

  const Alert = () => {
    return (
      <AlertDialog.Root open={isAlertOpen}>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>
            {love < 1 ? `你已跳出爱情陷阱` : `你已坠入爱情陷阱`}
          </AlertDialog.Title>
          <AlertDialog.Description size="2">
            {love < 1
              ? `竟然成功甩掉了${gender}！🎉`
              : `你没能甩掉${gender}😈，${gender}会一直缠着你，直到永远`}
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button
                variant="soft"
                color="gray"
                // className="background-color: *:"
                onClick={() => setIsAlertOpen(false)}
              >
                哦了
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                // className="background-color: *:"
                onClick={() => setGender(null)}
              >
                再来
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  };

  return (
    <main className="flex flex-col flex-grow items-center justify-center p-5 h-5/6">
      <Alert />
      <Card variant="surface" className="min-w-3/10">
        <Text as="div" size="2" weight="bold">
          {"❤️".repeat(sendCountDown)}
          {"🖤".repeat(8 - sendCountDown)}
        </Text>
        <Text as="div" color="gray" size="2">
          你的机会: {sendCountDown} / 8
        </Text>
        <Text as="div" color="gray" size="2">
          {gender}的爱意: {love} / 100
        </Text>
      </Card>

      <Separator orientation="horizontal" size="4" className="m-5" />
      <AutoScrollToBottom
        // @ts-ignore
        type="always"
        scrollbars="vertical"
        className="block flex-col items-start p-4 w-6/8"
      >
        {msgs.map((_msg, i) => (
          <div key={i} className="p-4 odd:bg-white even:bg-slate-50">
            <Avatar src="" fallback={i % 2 === 0 ? gender! : "我"} />
            <Text size="2" weight="bold" className="p-4">
              <MessageLine msg={_msg} />
            </Text>
          </div>
        ))}
      </AutoScrollToBottom>

      <div className="m-w-screen mt-7 w-5/6 shadow-lg">
        <TextField.Root>
          <TextField.Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="说点什么吧"
            size="3"
            onKeyDown={(ev) => {
              if (
                ev.key === "Enter" &&
                !ev.shiftKey &&
                !ev.nativeEvent.isComposing
              ) {
                send();
                ev.preventDefault();
              }
            }}
          />
          <TextField.Slot pr="3">
            <Button
              size="2"
              variant="ghost"
              disabled={!!!userInput.trim() || loading || love < 1}
              onClick={() => send()}
            >
              {loading ? <IconSpinner /> : <IconShare />}
            </Button>
          </TextField.Slot>
        </TextField.Root>
      </div>
    </main>
  );
}
