import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";

interface CamperCardProps {
  name: string;
  username: string;
  emoji: string;
  onSave: (newUsername: string) => void | Promise<void>;
  isSaving?: boolean;
}

const CamperCard = ({ name, username, emoji, onSave, isSaving = false }: CamperCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(username);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    try {
      await onSave(draft);
      setEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save username");
    }
  };

  const handleCancel = () => {
    setDraft(username);
    setEditing(false);
  };

  return (
    <Card className="relative overflow-hidden transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{emoji}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold text-foreground">{name}</h3>

            {editing ? (
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="h-9 text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={handleSave} className="shrink-0" disabled={isSaving}>
                  <Check className="h-4 w-4 mr-1" /> {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="shrink-0">
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            ) : (
              <div className="mt-1 flex items-center gap-3">
                <span className="text-muted-foreground text-sm font-medium">@{username}</span>
                <Button size="sm" variant="secondary" onClick={() => { setDraft(username); setEditing(true); }}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit Username
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Success toast */}
        <div
          className={`absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1.5 bg-success text-success-foreground py-2 text-sm font-semibold transition-all duration-300 ${
            showSuccess ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <Check className="h-4 w-4" /> Username updated!
        </div>
      </CardContent>
    </Card>
  );
};

export default CamperCard;
