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

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      const newMessage: Message = {
        id: messages.length + 1,
        content: input.trim(),
        isUser: true,
      };
      setMessages([...messages, newMessage]);
      
      // Simulate response (in real app, this would be an API call)
      setTimeout(() => {
        const responseMessage: Message = {
          id: messages.length + 2,
          content: "Thanks for your message. Our team will get back to you soon.",
          isUser: false,
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000);
      
      setInput('');
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
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button size="icon" onClick={handleSend}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}