"use client";

import { useState, startTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { useActionState } from "react";
import type { ContactStatus } from "@prisma/client";
import ViewContactDialog from "./view-contact-dialog";
import EditContactDialog from "./edit-contact-dialog";
import { deleteContact } from "@/app/actions/contactActions";

interface ContactsTableProps {
  initialContacts: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    status: ContactStatus;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export default function ContactsTable({ initialContacts }: ContactsTableProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const [deleteState, deleteAction, isDeleting] = useActionState(
    async (state: { success: boolean; message: string }, id: string) => {
      const result = await deleteContact(id);
      if (result.success) {
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
      }
      return result;
    },
    { success: false, message: "" }
  );

  const handleView = (contact: any) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
  };

  const handleEdit = (contact: any) => {
    setSelectedContact(contact);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this contact message?")
    ) {
      startTransition(() => {
        deleteAction(id);
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Message Snippet</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No contact messages found.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone || "N/A"}</TableCell>
                <TableCell>{contact.status}</TableCell>
                <TableCell>{contact.message.substring(0, 50)}...</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(contact)}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(contact)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(contact.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting && deleteState.message === "Deleting..." ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ViewContactDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        contact={selectedContact}
      />
      <EditContactDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        contact={selectedContact}
      />
    </div>
  );
}
