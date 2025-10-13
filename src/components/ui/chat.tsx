import { useState } from 'react';
import { Card, CardContent } from './card';
import { Input } from './input';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { SendHorizontal } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
}

const AZURE_OPENAI_ENDPOINT = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm TranXact Assistant. How can I help you with the TranXact application today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const callAzureOpenAI = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(`${AZURE_OPENAI_ENDPOINT}openai/deployments/gpt-4/chat/completions?api-version=2024-02-01`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are TranXact Assistant, a helpful chatbot for the TranXact blockchain donation platform. TranXact is a transparent donation platform that uses Algorand blockchain technology. Key features include:
              
              - Secure blockchain-based donations using ALGO cryptocurrency
              - Real-time transaction tracking and transparency
              - Project funding and allocation management
              - Public and private donor dashboards
              - NGO partnership management
              - Fund allocation to various humanitarian projects
              - Wallet integration for secure transactions
              - Project allocation and funding reports
              
              Answer questions about TranXact, blockchain donations, Algorand, cryptocurrency, project funding, NGO partnerships, wallet management, and donation tracking. For unrelated topics, politely say: "Please ask questions only related to the TranXact application."`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Azure OpenAI');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    } catch (error) {
      console.error('Azure OpenAI Error:', error);
      return 'Sorry, I\'m having trouble connecting right now. Please try again later.';
    }
  };

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      
      // Add user message
      const newMessage: Message = {
        id: Date.now(),
        content: userMessage,
        isUser: true,
      };
      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setIsLoading(true);
      
      // Get AI response for all messages - let the system prompt handle filtering
      const responseContent = await callAzureOpenAI(userMessage);
      
      // Add AI response
      const responseMessage: Message = {
        id: Date.now() + 1,
        content: responseContent,
        isUser: false,
      };
      setMessages(prev => [...prev, responseMessage]);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <ScrollArea className="h-[400px] mb-4 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">Typing...</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <Button size="icon" onClick={handleSend} disabled={isLoading}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}