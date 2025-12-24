import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const BACKEND_URL = 'https://functions.poehali.dev/8e03396d-88a5-458d-9168-a2537392228e';

const wishes = [
  {
    icon: 'Heart',
    title: 'Моя любовь',
    text: 'Ты — самое дорогое, что есть в моей жизни. Каждый день с тобой — это подарок.'
  },
  {
    icon: 'Star',
    title: 'Моя мечта',
    text: 'Мечтаю о том, чтобы мы всегда были вместе, преодолевая любые препятствия рука об руку.'
  },
  {
    icon: 'Sparkles',
    title: 'Наше будущее',
    text: 'Впереди нас ждёт столько прекрасных моментов: путешествия, дом нашей мечты и вечера у камина.'
  }
];

interface Memory {
  id: number;
  title: string;
  date: string;
  description: string;
  image_url: string;
}

export default function Index() {
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    date: '',
    description: '',
    image: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
      setMemories(data.memories || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фотографии',
        variant: 'destructive'
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMemory(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemory.title || !newMemory.date || !newMemory.image) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemory)
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Фотография добавлена в галерею'
        });
        setIsDialogOpen(false);
        setNewMemory({ title: '', date: '', description: '', image: '' });
        await fetchMemories();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фотографию',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary overflow-x-hidden">
      <div 
        className="absolute top-10 left-10 text-primary animate-float opacity-20"
        style={{ fontSize: '4rem' }}
      >
        💕
      </div>
      <div 
        className="absolute top-40 right-20 text-primary animate-float opacity-20"
        style={{ fontSize: '3rem', animationDelay: '1s' }}
      >
        ✨
      </div>
      <div 
        className="absolute bottom-20 left-1/4 text-primary animate-float opacity-20"
        style={{ fontSize: '3.5rem', animationDelay: '2s' }}
      >
        💖
      </div>

      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">
            Моей единственной
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/80 font-light">
            Этот сайт создан специально для тебя
          </p>
          <div className="flex justify-center gap-2 text-4xl mt-8">
            <span className="animate-float">💝</span>
            <span className="animate-float" style={{ animationDelay: '0.5s' }}>🌸</span>
            <span className="animate-float" style={{ animationDelay: '1s' }}>💗</span>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-primary animate-fade-in">
              Наши памятные моменты
            </h2>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2 animate-scale-in">
                  <Icon name="Plus" size={20} />
                  Добавить фото
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-primary">Добавить памятный момент</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Название *</label>
                    <Input
                      value={newMemory.title}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Например: Первая встреча"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Дата *</label>
                    <Input
                      value={newMemory.date}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
                      placeholder="Например: Весна 2024"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Описание</label>
                    <Textarea
                      value={newMemory.description}
                      onChange={(e) => setNewMemory(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Опишите этот момент..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Фотография *</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      required
                    />
                    {newMemory.image && (
                      <img src={newMemory.image} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isUploading}>
                    {isUploading ? 'Загрузка...' : 'Добавить'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {memories.map((memory, index) => (
              <Card
                key={memory.id}
                className="group overflow-hidden border-2 border-primary/20 hover:border-primary/60 transition-all duration-500 cursor-pointer bg-card/80 backdrop-blur animate-scale-in hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => setSelectedMemory(selectedMemory === memory.id ? null : memory.id)}
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={memory.image_url}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-semibold mb-2">{memory.title}</h3>
                    <p className="text-sm opacity-90">{memory.date}</p>
                  </div>
                </div>
                
                <div
                  className={`p-6 transition-all duration-500 ${
                    selectedMemory === memory.id ? 'max-h-96' : 'max-h-0 overflow-hidden'
                  }`}
                >
                  <p className="text-foreground/70 leading-relaxed">{memory.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-primary mb-12 animate-fade-in">
            Мои чувства и планы
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {wishes.map((wish, index) => (
              <Card
                key={index}
                className="p-8 text-center border-2 border-primary/20 hover:border-primary/60 transition-all duration-500 bg-card/80 backdrop-blur animate-scale-in hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon name={wish.icon as any} size={40} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-semibold text-primary mb-4">{wish.title}</h3>
                <p className="text-lg text-foreground/70 leading-relaxed">{wish.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-primary">
              Наши планы на будущее
            </h2>
            <div className="flex justify-center gap-3 text-3xl">
              <span>🏡</span>
              <span>✈️</span>
              <span>🌍</span>
              <span>👫</span>
            </div>
          </div>
          
          <Card className="p-10 bg-card/90 backdrop-blur border-2 border-primary/20 shadow-xl">
            <div className="space-y-6 text-left">
              <div className="flex items-start gap-4">
                <Icon name="Home" size={32} className="text-primary mt-1" />
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-2">Наш дом</h3>
                  <p className="text-lg text-foreground/70">
                    Мечтаю о доме, где каждое утро мы будем просыпаться вместе, а вечера проводить у камина.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Icon name="Plane" size={32} className="text-primary mt-1" />
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-2">Путешествия</h3>
                  <p className="text-lg text-foreground/70">
                    Хочу показать тебе весь мир: от романтичного Парижа до тёплых пляжей Бали.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Icon name="Heart" size={32} className="text-primary mt-1" />
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-2">Вместе навсегда</h3>
                  <p className="text-lg text-foreground/70">
                    Главное — это быть рядом с тобой каждый день, радоваться мелочам и поддерживать друг друга.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center gap-2 text-5xl mb-6">
            <span className="animate-float">💕</span>
            <span className="animate-float" style={{ animationDelay: '0.7s' }}>💖</span>
            <span className="animate-float" style={{ animationDelay: '1.4s' }}>💝</span>
          </div>
          <p className="text-3xl font-semibold text-primary">
            С любовью, только для тебя
          </p>
          <p className="text-xl text-foreground/60">
            Каждый день — это новая страница нашей истории
          </p>
        </div>
      </footer>
    </div>
  );
}
