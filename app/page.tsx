"use client";
import Choice from "@/components/Choice/ChoiceWindow";
import Chat from "@/components/Chat/ChatWindow";
import { useUser } from "@/contexts/UserContext";
export default function Home() {
  const { gender, setGender } = useUser();

  if (!!gender) {
    return <Chat />;
  } else {
    return <Choice />;
  }
}
