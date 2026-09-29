// Team Squad manager — add (with avatar upload or URL) and delete team
// members shown on the public About page.
"use client";

import { useEffect, useState } from "react";
import MediaImage from "@/components/shared/MediaImage";
import { Trash2, UploadCloud, Loader2 } from "lucide-react";
import { getTeamMembers, createTeamMember, deleteTeamMember, uploadImage } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TeamMember = { id: number; name: string; role: string; image: string };

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [adding, setAdding] = useState(false);

  const fetchTeam = () => {
    getTeamMembers()
      .then((data) => setTeam(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Upload the chosen photo and use the returned URL for the form's image field.
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadImage(file);
      setImage(res.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setUploadingImage(false);
    }
  };

  // Create flow: require all three fields, POST the member, then clear the
  // form and refetch so the grid gets fresh ids.
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !image) {
      alert("Please fill in Name, Role, and Photo");
      return;
    }
    setAdding(true);
    try {
      await createTeamMember({ name, role, image });
      setName("");
      setRole("");
      setImage("");
      setLoading(true);
      await fetchTeam();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add team member");
    } finally {
      setAdding(false);
    }
  };

  // Delete flow: confirm(), then remove the matching id from local state.
  const handleDelete = async (id: number, tName: string) => {
    if (!confirm(`Delete team member "${tName}"?`)) return;
    try {
      await deleteTeamMember(id);
      setTeam((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete team member");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Team Squad ({team.length})
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Manage creators, directors, and developers showcased on the About Us page.
        </p>
      </div>

      {/* Add Member Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add Team Member</CardTitle>
          <CardDescription>Name, role title, and avatar photo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                Name *
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fiona Sid"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                Role / Title *
              </label>
              <Input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Head of Strategy"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/60 mb-1 uppercase">
                Photo URL / Upload *
              </label>
              <div className="flex gap-1.5">
                <Input
                  type="text"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Image URL"
                  className="flex-1"
                />
                <label className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-accent cursor-pointer hover:border-accent">
                  <UploadCloud className="h-4 w-4" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end pt-1">
              <Button
                type="submit"
                disabled={adding || uploadingImage}
                size="sm"
                className="font-semibold"
              >
                {adding ? "Adding..." : "+ Add Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Team Grid */}
      {loading ? (
        <Card className="p-16 text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-accent" />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {team.map((m) => (
            <Card
              key={m.id || m.name}
              className="p-2.5 flex flex-col justify-between hover:border-accent/40 transition-all"
            >
              <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-black/40 border border-white/5 mb-2">
                <MediaImage src={m.image} alt={m.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white truncate">{m.name}</h4>
                <p className="font-mono text-[10px] text-white/50 truncate mt-0.5">{m.role}</p>
              </div>
              <div className="border-t border-white/5 pt-1.5 mt-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(m.id, m.name)}
                  className="h-6 w-6 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
