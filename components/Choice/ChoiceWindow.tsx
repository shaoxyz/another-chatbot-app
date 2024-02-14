"use client";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Text, Heading, Flex } from "@radix-ui/themes";
import Image from "next/image";
import logo from "@/public/logo-c.png";
export default function Choice() {
  const { gender, setGender } = useUser();
  const [start, setStart] = useState(true);

  const handleMaleButtonClick = () => {
    setGender("他");
  };

  const handleFemaleButtonClick = () => {
    setGender("她");
  };

  function Start() {
    return (
      <div className="container flex justify-center gap-4 m-5">
        <button
          type="button"
          className="male-button bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-24 h-16 flex items-center justify-center font-bold text-xl border shadow-blue-600 shadow-lg"
          onClick={() => setStart(true)}
        >
          开始游戏
        </button>
      </div>
    );
  }

  function SelectGender() {
    return (
      <>
        <div className="container flex justify-center gap-4 m-5">
          <button
            type="button"
            className="male-button bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-20 h-16 flex items-center justify-center font-bold text-xl border shadow-blue-600 shadow-lg"
            onClick={handleMaleButtonClick}
          >
            <span className="male-icon text-3xl">♂</span>
          </button>
          <button
            type="button"
            className="female-button bg-pink-600 hover:bg-pink-700 text-white rounded-lg w-20 h-16 flex items-center justify-center font-bold text-xl border shadow-pink-600 shadow-lg"
            onClick={handleFemaleButtonClick}
          >
            <span className="female-icon text-3xl">♀</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <main className="flex flex-col flex-grow items-center justify-center h-5/6 p-4">
      <Heading className="font-bold over" size="5">
        完蛋，你被恋爱脑AI纠缠了
      </Heading>
      <Image
        className="size-40 m-3"
        src={logo}
        alt={""}
        priority={true}
      ></Image>
      <Flex direction="column" gap="3" className="items-center justify-center">
        <Text className="">AI正在对你死缠烂打</Text>
        <Text className="">你根本不喜欢Ta</Text>
        <Text className="">
          必须在有限的回合内<b>放狠话让Ta彻底死心！</b>
        </Text>

        <Text className="">{start ? "选择Ta的性别" : ""}</Text>
      </Flex>
      {!start ? <Start /> : <SelectGender />}
    </main>
  );
}
