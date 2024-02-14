import chat from "@/lib/llm";
import { encrypt } from "@/lib/utils";

export async function POST(request: Request) {
  const json = await request.json();
  const { gender, follow_msgs } = json;
  // @ts-ignore
  const { ai_msg, ai_score } = await chat(gender, follow_msgs);
  // Generate a random initialization vector
  const randomNumber = Math.random().toString();
  const encrypted = encrypt(randomNumber, { ai_msg,  ai_score });
  console.log(encrypted)
  // Send the encrypted data and IV to the client
  return new Response(encrypted, {
    status: 200,
    headers: { 'iv': randomNumber },
  });
}