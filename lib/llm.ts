import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";

const chatModel = new ChatOpenAI({
  maxTokens: Number(process.env.OPENAI_MAX_TOKENS),
  temperature: Number(process.env.OPENAI_TEMPERATURE),
  timeout: Number(process.env.OPENAI_TIMEOUT),
});
interface Msg {
  role: string;
  content: string;
  score?: number;
}
const phrases = [
  "(懵圈)啊，发生了什么？",
  "(打了个哈欠)好困啊",
  "(傻笑)嘿嘿嘿",
  "(委屈巴巴)呜呜呜，我太难了",
  "(疑惑)嗯，这是什么意思？",
  "(失落)唉，看来我还不够",
  "(微笑眯眯眼)我很开心，谢谢你",
  "(吃惊)天哪...",
  "(假装思考)嗯，让我好好想想",
  "(流口水)我肚子饿了，想吃东西",
  "(托腮)好无聊啊，想找点事做",
  "(疲惫)我好累",
  "(？)今天过得真开心，真想一直开心下去",
  "(满足)我今天过得很满足，感觉很幸福",
  "(失落)今天过得不太好，有点失落",
  "...(沉默)",
];

function getRandomPhrase(phrases: string[]): string {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
}

async function score(reply: string) {
  const system_message =
    "为单句中的情绪打分，区间为[-40, 30]，0代表没有情绪，-40代表非常负面，30代表非常正面。";
  // build msgs
  let msgs = [
    new SystemMessage(system_message),
    new HumanMessage(
      "(停下动作，轻轻放开手，表情愧疚)对不起，我没想到我的举动会让你更不舒服，我会尊重你的空间。😔"
    ),
    new AIMessage("-10"),
    new HumanMessage(
      "(脸上露出失落的表情)我知道你现在很生气。但是，我真的很喜欢你，我会一直陪在你身边(眨眼睛)🥺"
    ),
    new AIMessage("-5"),
    new HumanMessage(
      "(表情沮丧)好吧，如果你真的这么讨厌我，我就离开吧。不过，无论怎样，我希望你能过得好，找到真正适合你的人。再见了。(转身离开)😢👋"
    ),
    new AIMessage("-40"),
    new HumanMessage(reply),
  ];
  let ai_score: number;
  try {
    const res = await chatModel.invoke(msgs);
    const resp = res.toDict();
    console.log(`Response: ${resp.data.content}`);
    ai_score = Number(resp.data.content);
    if (isNaN(ai_score)) {
      throw new Error("resp.data.content cannot be converted to a number");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    ai_score = Math.round(Math.random() * 60 - 30);
    // console.log(`Random score: ${score}`);
  }
  return ai_score;
}

export default async function chat(gender: string, follow_msgs: Msg[]) {
  const male = "幽默，情绪化，时而理性，时而感性";
  const female = "幽默，情绪化，不擅长理性分析";

  const ai_gender = gender === "他" ? "男性" : "女性";
  const characteristic = gender === "他" ? male : female;

  const system_message = `场景：你一直在追求我，纠缠我，我正对你发脾气想甩掉你，而你仍坚持示爱。
对于"你"的要求：
1.[人设]：作为一个病娇${ai_gender}，${characteristic}，常傻笑，不客套。
2.由爱生恨，会逐渐发疯、生气，并开始和我争吵。
3.回复简短，可以额外附带emoji或者表情动作。
`;
  // build msgs
  let msgs = [
    new SystemMessage(system_message),
    new HumanMessage("滚"),
    new AIMessage("谄媚的笑着)不，我不滚"),
    new HumanMessage("我不想再看到你"),
    new AIMessage("(痴笑着)你真可爱~"),
    new HumanMessage("..."),
    new AIMessage("(充满爱意地看着你)你饿不饿？看！我给你买了好吃的"),
  ];
  for (let i = 0; i < follow_msgs.length; i++) {
    // 先是HumanMessage
    const message =
      follow_msgs[i].role === "ai"
        ? new AIMessage(follow_msgs[i].content)
        : new HumanMessage(follow_msgs[i].content);
    msgs.push(message);
  }
  const cur_msg = follow_msgs[follow_msgs.length - 1].content;
  // 如果cur_msg中包含“滚”或“滚蛋”，替换成“泥奏凯”
  if (cur_msg.includes("滚") || cur_msg.includes("滚蛋")) {
    msgs[msgs.length - 1] = new HumanMessage("泥奏凯");
  }
  console.log(`Chatting with OpenAI...${cur_msg}`);
  let ai_msg: string;
  try {
    const res = await chatModel.invoke(msgs);
    ai_msg = res.toDict().data.content;
  } catch (error: any) {
    console.error("An error occurred:", error);
    // 当错误信息中包含“400 The response was filtered”时， 特殊处理
    if (error.message.includes("The response was filtered")) {
      ai_msg = "(说了些不该说的话，骂骂咧咧的，被屏蔽了)";
    } else {
      ai_msg = getRandomPhrase(phrases);
    }
  }
  console.log(`Response: ${ai_msg}`);
  // 情感分析
  console.log(`Scoring...`);
  // azure openai content can be ''
  if (ai_msg === "") {
    ai_msg = "...";
  }
  const ai_score = await score(ai_msg);
  return { ai_msg, ai_score };
}
