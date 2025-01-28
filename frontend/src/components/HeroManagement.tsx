"use client" // Indicates this is a client-side component in Next.js

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const HeroManagement = () => {
  // Define the Hero interface for TypeScript type safety
  interface Hero {
    id: number;
    name: string;
    superpower: string;
    avatar: string;
    humility_score: string;
  }
  
  // Tracks form submission state
  const [isLoading, setIsLoading] = useState(false);
  // Stores all heroes
  const [heroes, setHeroes] = useState<Hero[]>([]);
  // Stores form data for new hero
  const [newHero, setNewHero] = useState<Partial<Hero>>({
    name: '',
    superpower: '',
    avatar: '',
    humility_score: ''
  });

  // Fetch heroes when component mounts
  useEffect(() => {
    fetchHeroes();
  }, []);

  // Function to fetch heroes from the API
  const fetchHeroes = async () => {
    try {
      const response = await fetch('http://localhost:4000/superhero');
      const { data } = await response.json();
      setHeroes(data);
    } catch (error) {
      console.error('Error fetching heroes:', error);
    }
  };

  // update newHero state with form inputs in real time 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHero(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission to create new hero
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/superhero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHero),
      });

      if (response.ok) {
        // Reset form and refresh hero list on successful submission
        setNewHero({ name: '', superpower: '', humility_score: '' });
        // fetch heroes again to update the list
        fetchHeroes();
      }
    } catch (error) {
      console.error('Error creating hero:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // UI rendered using Shadcn UI components
  return (
    <div className="container mx-auto p-4">
      {/* New Hero Form Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Hero</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name input field */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={newHero.name}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Superpower input field */}
            <div>
              <Label htmlFor="superpower">Superpower</Label>
              <Input
                id="superpower"
                name="superpower"
                value={newHero.superpower}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Humility Score input field */}
            <div>
              <Label htmlFor="humility_score">Humility Score (1-10)</Label>
              <Input
                id="humility_score"
                name="humility_score"
                type="number"
                min="1"
                max="10"
                value={newHero.humility_score}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Hero'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Heroes List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hero List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Map through heroes array to display each hero */}
            {heroes.map((hero) => (
              <div
                key={hero.id}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="w-16 sm:w-20 md:w-24 lg:w-28 relative">
                  <Image
                    src={hero.avatar}
                    alt={`${hero.name}'s avatar`}
                    className="rounded-full"
                    layout="responsive" // Make the image responsive
                    width={1} // Maintain aspect ratio
                    height={1} // Maintain aspect ratio
                  />
                </div>
                <p className="text-gray-600">Name: {hero.name}</p>
                <p className="text-gray-600">Superpower: {hero.superpower}</p>
                <p className="text-gray-600"> Humility Score: {hero.humility_score}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroManagement;
