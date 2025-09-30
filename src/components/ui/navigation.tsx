import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-8 right-8 flex gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => navigate(-1)}
        className="rounded-full shadow-lg"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => navigate(1)}
        className="rounded-full shadow-lg"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}