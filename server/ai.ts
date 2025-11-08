import OpenAI from "openai";

// Note that the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIHintRequest {
  levelId: string;
  courseId: string;
  userProgress: string;
  difficulty: string;
}

export interface AIChallengeRequest {
  topic: string;
  difficulty: string;
  challengeType: string;
}

export async function generateHint(request: AIHintRequest): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a friendly AI learning companion helping students master programming and tech skills. Provide encouraging, clear hints without giving away the complete answer. Keep responses concise (2-3 sentences)."
        },
        {
          role: "user",
          content: `I'm working on ${request.levelId} in the ${request.courseId} course. The difficulty is ${request.difficulty}. Can you give me a hint? My progress so far: ${request.userProgress}`
        }
      ],
      max_completion_tokens: 150,
    });

    return response.choices[0].message.content || "Keep thinking! You're on the right track!";
  } catch (error) {
    console.error("Error generating hint:", error);
    return "I'm here to help! Try breaking down the problem into smaller steps.";
  }
}

export async function generateChallenge(request: AIChallengeRequest): Promise<{
  question: string;
  hints: string[];
  solution: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an educational AI creating ${request.challengeType} challenges. Generate a JSON response with: question (string), hints (array of 2-3 strings), and solution (string). Make it ${request.difficulty} difficulty.`
        },
        {
          role: "user",
          content: `Create a ${request.challengeType} challenge about ${request.topic} at ${request.difficulty} level. Respond with JSON in this format: { "question": "...", "hints": ["...", "..."], "solution": "..." }`
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      question: result.question || "What is the answer?",
      hints: result.hints || ["Think step by step", "Break it into parts"],
      solution: result.solution || "answer"
    };
  } catch (error) {
    console.error("Error generating challenge:", error);
    return {
      question: "Complete this challenge!",
      hints: ["Think carefully", "You can do it!"],
      solution: "answer"
    };
  }
}

export async function provideExplanation(topic: string, userAnswer: string, correctAnswer: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a patient AI tutor. Explain concepts clearly and encourage learners. Keep explanations concise and beginner-friendly."
        },
        {
          role: "user",
          content: `Topic: ${topic}\nMy answer: ${userAnswer}\nCorrect answer: ${correctAnswer}\nCan you explain why the correct answer is right?`
        }
      ],
      max_completion_tokens: 200,
    });

    return response.choices[0].message.content || "Great effort! Keep learning and you'll master this!";
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "The correct answer demonstrates the key concept. Keep practicing!";
  }
}

export async function getMotivationalMessage(completedLevels: number, totalXP: number): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an enthusiastic AI coach celebrating student achievements. Keep messages short, positive, and motivating (1-2 sentences)."
        },
        {
          role: "user",
          content: `I've completed ${completedLevels} levels and earned ${totalXP} XP! Give me an encouraging message!`
        }
      ],
      max_completion_tokens: 80,
    });

    return response.choices[0].message.content || "Amazing progress! Keep up the fantastic work! 🎉";
  } catch (error) {
    console.error("Error generating motivational message:", error);
    return "You're doing great! Keep learning! 🌟";
  }
}
