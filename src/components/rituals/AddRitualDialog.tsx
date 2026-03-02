// src/components/rituals/AddRitualDialog.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";

// Zod schema
const addRitualSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  frequency: z.enum(["Daily", "Weekdays", "Weekly", "Monthly"]),
});

type AddRitualForm = z.infer<typeof addRitualSchema>;

type AddRitualDialogProps = {
  onAdd: (data: AddRitualForm) => Promise<void>;
};

export default function AddRitualDialog({ onAdd }: AddRitualDialogProps) {
  const form = useForm<AddRitualForm>({
    resolver: zodResolver(addRitualSchema),
    defaultValues: {
      name: "",
      description: "",
      frequency: "Daily",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: AddRitualForm) => {
    try {
      await onAdd(data);
      toast.success("Ritual added successfully!");
      reset();
    } catch {
      toast.error("Failed to add ritual. Try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Ritual
        </Button>
      </DialogTrigger>

      <DialogContent className="border border-zinc-300 bg-white shadow-2xl sm:max-w-lg dark:border-zinc-700 dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Ritual</DialogTitle>
          <DialogDescription className="text-zinc-600 dark:text-zinc-400">
            Create a habit to track daily or weekly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Morning meditation"
              {...register("name")}
              className="h-12"
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description (optional)
            </Label>
            <Input
              id="description"
              placeholder="10 minutes breathing exercise"
              {...register("description")}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-base font-medium">
              Frequency
            </Label>
            <Select
              defaultValue="Daily"
              onValueChange={(val) => form.setValue("frequency", val as any)}
            >
              <SelectTrigger id="frequency" className="h-12">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekdays">Weekdays</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.frequency.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-35">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Ritual"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
