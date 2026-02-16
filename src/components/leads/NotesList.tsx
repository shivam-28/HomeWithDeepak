"use client";

import { useState } from "react";
import { addNote } from "@/lib/firebase/firestore";
import { Note } from "@/types";
import { Button } from "@/components/ui/Button";
import { formatRelative } from "@/lib/utils/dates";
import { Send } from "lucide-react";

interface NotesListProps {
  leadId: string;
  notes: Note[];
  onNoteAdded: () => void;
}

export function NotesList({ leadId, notes, onNoteAdded }: NotesListProps) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await addNote(leadId, text.trim());
      setText("");
      onNoteAdded();
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Notes</h3>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a note..."
          className="flex-1 min-h-[44px] rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Button
          onClick={handleAdd}
          loading={saving}
          size="sm"
          className="min-w-[44px]"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-gray-400">No notes yet</p>
      ) : (
        <div className="space-y-2">
          {[...notes].reverse().map((note) => (
            <div
              key={note.id}
              className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
            >
              <p>{note.text}</p>
              <p className="mt-1 text-xs text-gray-400">
                {formatRelative(note.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
