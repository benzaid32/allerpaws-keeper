
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";

interface PasswordResetFormProps {
  resetEmail: string;
  setResetEmail: (email: string) => void;
  handlePasswordReset: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  resetEmail,
  setResetEmail,
  handlePasswordReset,
  onCancel,
}) => {
  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email" className="text-[#033b5c]">Email</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="name@example.com"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          className="border-[#a4e1e9]/30 focus-visible:ring-[#33c1db]/30 rounded-xl"
        />
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-[#033b5c] text-[#033b5c]"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-[#033b5c] hover:bg-[#033b5c]/90 text-white"
        >
          Send reset link
        </Button>
      </DialogFooter>
    </form>
  );
};

export default PasswordResetForm;
