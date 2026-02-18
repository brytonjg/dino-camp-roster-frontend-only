import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CamperCard from "@/components/CamperCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface Camper {
  id: number;
  name: string;
  username: string;
  emoji: string;
}

const CAMPER_EMOJIS = ["🦕", "🦖", "🦴", "🌋"];

function toDisplayName(username: string): string {
  return username
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function userToCamper(user: User, index: number): Camper {
  return {
    id: user.id,
    name: toDisplayName(user.username),
    username: user.username,
    emoji: CAMPER_EMOJIS[index % CAMPER_EMOJIS.length],
  };
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/api/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

async function updateUser(id: number, username: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update user");
  }
  return res.json();
}

const Index = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, username }: { id: number; username: string }) =>
      updateUser(id, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const campers: Camper[] = users.map((u, i) => userToCamper(u, i));

  const handleSave = async (id: number, newUsername: string) => {
    await updateMutation.mutateAsync({ id, username: newUsername });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading campers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Failed to load campers. Is the backend running?</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="py-10 text-center">
        <p className="text-4xl mb-2">🦕</p>
        <h1 className="font-display text-4xl font-bold text-foreground">
          Dino Discovery Camp
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Summer 2026 · Enrolled Campers
        </p>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-16 space-y-4">
        {campers.map((c) => (
          <CamperCard
            key={c.id}
            name={c.name}
            username={c.username}
            emoji={c.emoji}
            onSave={(newUsername) => handleSave(c.id, newUsername)}
            isSaving={updateMutation.isPending}
          />
        ))}
      </main>
    </div>
  );
};

export default Index;
