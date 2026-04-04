"use client";

import { useState, useEffect } from "react";
import { useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Trash2, 
  Users, 
  Edit, 
  Plus,
  Upload,
  Image as ImageIcon,
  MoveUp,
  MoveDown
} from "lucide-react";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/app/actions/team";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  email?: string;
  phone?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface TeamManagementProps {
  initialTeamMembers: TeamMember[];
  onUpdate: () => void;
}

export default function TeamManagement({ initialTeamMembers, onUpdate }: TeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const createInitialState = { success: false, message: "" };
  const [createState, createFormAction, isCreating] = useActionState(createTeamMember, createInitialState);
  const createFormRef = useRef<HTMLFormElement>(null);
  const createFileInputRef = useRef<HTMLInputElement>(null);

  const updateInitialState = { success: false, message: "" };
  const [updateState, updateFormAction, isUpdating] = useActionState(updateTeamMember, updateInitialState);
  const updateFormRef = useRef<HTMLFormElement>(null);
  const updateFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (createState.success) {
      setIsCreateDialogOpen(false);
      createFormRef.current?.reset();
      // Fetch updated team members from parent
      onUpdate();
      alert(createState.message);
    }
  }, [createState]);

  useEffect(() => {
    if (updateState.success) {
      setIsEditDialogOpen(false);
      updateFormRef.current?.reset();
      // Fetch updated team members from parent
      onUpdate();
      alert(updateState.message);
    }
  }, [updateState]);

  // Update team members when parent provides new data
  useEffect(() => {
    setTeamMembers(initialTeamMembers);
  }, [initialTeamMembers]);

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedMember) {
      setIsDeleting(true);
      try {
        const result = await deleteTeamMember(selectedMember.id);
        if (result.success) {
          onUpdate();
          alert(result.message);
          setIsDeleteDialogOpen(false);
        } else {
          alert(result.message || "Failed to delete team member");
        }
      } catch (error) {
        console.error("Error deleting team member:", error);
        alert("An error occurred while deleting team member");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const moveMember = async (member: TeamMember, direction: 'up' | 'down') => {
    const currentIndex = teamMembers.findIndex(m => m.id === member.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < teamMembers.length) {
      const updatedMembers = [...teamMembers];
      const temp = updatedMembers[currentIndex].order;
      updatedMembers[currentIndex].order = updatedMembers[newIndex].order;
      updatedMembers[newIndex].order = temp;
      
      // Sort by order
      updatedMembers.sort((a, b) => a.order - b.order);
      setTeamMembers(updatedMembers);
      
      // Here you would typically update the database with the new orders
      // For now, we'll just update the local state
    }
  };

  return (
    <Card className="rounded-xl sm:rounded-2xl shadow-lg">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Team Management
          </CardTitle>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        {/* Mobile Cards View */}
        <div className="block sm:hidden space-y-4">
          {teamMembers.map((member, index) => (
            <div key={member.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {member.image ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{member.order + 1}</span>
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveMember(member, 'up')}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <MoveUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveMember(member, 'down')}
                      disabled={index === teamMembers.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <MoveDown className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {member.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Email:</span>
                    <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline truncate">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Phone:</span>
                    <a href={`tel:${member.phone}`} className="text-green-600 hover:underline">
                      {member.phone}
                    </a>
                  </div>
                )}
                <div className="text-xs text-gray-400">
                  ID: {member.id.slice(0, 8)}...
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedMember(member);
                    setIsEditDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedMember(member);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order</TableHead>
                <TableHead>Team Member</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-24">Image</TableHead>
                <TableHead className="text-right w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{member.order + 1}</span>
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveMember(member, 'up')}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <MoveUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveMember(member, 'down')}
                          disabled={index === teamMembers.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <MoveDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">ID: {member.id.slice(0, 8)}...</div>
                  </TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>
                    {member.email ? (
                      <div className="text-sm">
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No email</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {member.phone ? (
                      <div className="text-sm">
                        <a href={`tel:${member.phone}`} className="text-green-600 hover:underline">
                          {member.phone}
                        </a>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">No phone</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {member.image ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(member)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Create Team Member Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Add Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member to display on the website.
              </DialogDescription>
            </DialogHeader>
            <form ref={createFormRef} action={createFormAction}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter team member's full name"
                    required
                    disabled={isCreating}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-semibold text-gray-700">
                    Position / Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    type="text"
                    placeholder="e.g., CEO, Manager, Developer"
                    required
                    disabled={isCreating}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="member@company.com"
                    disabled={isCreating}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+250 7XX XXX XXX"
                    disabled={isCreating}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-sm font-semibold text-gray-700">
                    Display Order <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    placeholder="0"
                    disabled={isCreating}
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500">Lower numbers appear first</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image" className="text-sm font-semibold text-gray-700">
                    Profile Photo <span className="text-red-500">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                    <input
                      ref={createFileInputRef}
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      disabled={isCreating}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => createFileInputRef.current?.click()}
                      disabled={isCreating}
                      className="text-orange-600 hover:text-orange-700 font-semibold flex flex-col items-center"
                    >
                      <Upload className="w-10 h-10 mb-2" />
                      <span>Click to upload photo</span>
                    </button>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {createState.message && (
                  <div className={`p-3 rounded-lg text-sm md:col-span-2 ${
                    createState.success
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {createState.message}
                  </div>
                )}
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Adding..." : "Add Team Member"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Team Member Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Team Member</DialogTitle>
              <DialogDescription>
                Update team member information and profile photo.
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <form ref={updateFormRef} action={updateFormAction}>
                <input type="hidden" name="id" value={selectedMember.id} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-name"
                      name="name"
                      type="text"
                      defaultValue={selectedMember.name}
                      placeholder="Enter team member's full name"
                      required
                      disabled={isUpdating}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-position" className="text-sm font-semibold text-gray-700">
                      Position / Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-position"
                      name="position"
                      type="text"
                      defaultValue={selectedMember.position}
                      placeholder="e.g., CEO, Manager, Developer"
                      required
                      disabled={isUpdating}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email" className="text-sm font-semibold text-gray-700">
                      Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      defaultValue={selectedMember.email || ''}
                      placeholder="member@company.com"
                      disabled={isUpdating}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone" className="text-sm font-semibold text-gray-700">
                      Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="edit-phone"
                      name="phone"
                      type="tel"
                      defaultValue={selectedMember.phone || ''}
                      placeholder="+250 7XX XXX XXX"
                      disabled={isUpdating}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-order" className="text-sm font-semibold text-gray-700">
                      Display Order <span className="text-gray-400 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="edit-order"
                      name="order"
                      type="number"
                      defaultValue={selectedMember.order}
                      placeholder="0"
                      disabled={isUpdating}
                      className="h-11"
                    />
                    <p className="text-xs text-gray-500">Lower numbers appear first</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="edit-image" className="text-sm font-semibold text-gray-700">
                      Profile Photo <span className="text-gray-400 font-normal">(Optional)</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <input
                        ref={updateFileInputRef}
                        id="edit-image"
                        name="image"
                        type="file"
                        accept="image/*"
                        disabled={isUpdating}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => updateFileInputRef.current?.click()}
                        disabled={isUpdating}
                        className="text-orange-600 hover:text-orange-700 font-semibold flex flex-col items-center"
                      >
                        <Upload className="w-10 h-10 mb-2" />
                        <span>Click to change photo</span>
                      </button>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                      <p className="text-sm text-gray-400 mt-1">Leave empty to keep current photo</p>
                      {selectedMember.image && (
                        <div className="mt-4 flex flex-col items-center">
                          <p className="text-xs text-gray-500 mb-2">Current photo:</p>
                          <img
                            src={selectedMember.image}
                            alt="Current profile"
                            className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {updateState.message && (
                    <div className={`p-3 rounded-lg text-sm md:col-span-2 ${
                      updateState.success
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {updateState.message}
                    </div>
                  )}
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Team Member"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Team Member
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this team member? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Team member to be deleted:</h4>
                  <p><strong>Name:</strong> {selectedMember.name}</p>
                  <p><strong>Position:</strong> {selectedMember.position}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Team Member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
