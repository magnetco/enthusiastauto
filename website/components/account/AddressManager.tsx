"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { addressSchema, type Address, type AddressInput } from "@/lib/profile/types";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Plus } from "lucide-react";

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "USA",
      isDefault: false,
    },
  });

  const isDefault = watch("isDefault");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/user/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  const openAddDialog = () => {
    reset({
      label: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA",
      phone: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    reset(address);
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: AddressInput) => {
    setIsLoading(true);
    try {
      const url = editingAddress
        ? `/api/user/addresses/${editingAddress.id}`
        : "/api/user/addresses";
      const method = editingAddress ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save address");
      }

      toast.success(editingAddress ? "Address updated" : "Address added");
      setIsDialogOpen(false);
      fetchAddresses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      toast.success("Address deleted");
      setDeleteConfirm(null);
      fetchAddresses();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        {addresses.length === 0 ? (
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-body-large font-semibold text-foreground mb-1">
              No saved addresses
            </h3>
            <p className="text-body-base text-muted-foreground mb-6">
              Add an address to speed up checkout.
            </p>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </CardContent>
        ) : (
          <CardContent className="divide-y divide-border p-0">
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start justify-between gap-4 p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-body-base font-medium text-foreground">
                      {address.label}
                    </p>
                    {address.isDefault && (
                      <Badge variant="secondary" className="text-body-mini">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-body-small text-muted-foreground">
                    {address.street}, {address.city}, {address.state} {address.postalCode}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(address)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    disabled={isLoading}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {deleteConfirm === address.id ? "Confirm?" : "Delete"}
                  </Button>
                </div>
              </div>
            ))}
            <div className="p-5">
              <Button variant="outline" onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                {...register("label")}
                placeholder="Home, Work, etc."
                disabled={isLoading}
              />
              {errors.label && (
                <p className="text-body-small text-destructive">{errors.label.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...register("street")}
                placeholder="123 Main St"
                disabled={isLoading}
              />
              {errors.street && (
                <p className="text-body-small text-destructive">{errors.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} disabled={isLoading} />
                {errors.city && (
                  <p className="text-body-small text-destructive">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register("state")} disabled={isLoading} />
                {errors.state && (
                  <p className="text-body-small text-destructive">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...register("postalCode")} disabled={isLoading} />
                {errors.postalCode && (
                  <p className="text-body-small text-destructive">{errors.postalCode.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="(555) 123-4567"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setValue("isDefault", checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="isDefault" className="text-body-base cursor-pointer">
                Set as default address
              </Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingAddress ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
