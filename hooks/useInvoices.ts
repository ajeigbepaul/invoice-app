import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Invoice, CreateInvoiceInput, UpdateInvoiceInput } from "@/types/invoice";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const INVOICES_QUERY_KEY = ["invoices"];

export function useInvoices(status?: string) {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, status || "all"],
    queryFn: async () => {
      try {
        return await api.invoices.getAll(status);
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch invoices");
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: [...INVOICES_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await api.invoices.getById(id);
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch invoice");
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvoiceInput) => {
      try {
        return await api.invoices.create(data);
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      toast.success("Invoice created successfully");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to create invoice";
      toast.error(message);
      throw error;
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvoiceInput }) => {
      try {
        return await api.invoices.update(id, data);
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      queryClient.setQueryData([...INVOICES_QUERY_KEY, variables.id], data);
      toast.success("Invoice updated successfully");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to update invoice";
      toast.error(message);
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await api.invoices.delete(id);
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      toast.success("Invoice deleted successfully");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to delete invoice";
      toast.error(message);
    },
  });
}

export function useMarkAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await api.invoices.markAsPaid(id);
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      toast.success("Invoice marked as paid");
    },
    onError: (error: any) => {
      const message = error.message || "Failed to mark invoice as paid";
      toast.error(message);
    },
  });
}
