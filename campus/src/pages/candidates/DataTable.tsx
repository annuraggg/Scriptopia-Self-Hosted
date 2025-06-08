"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  UserMinusIcon,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Eye,
} from "lucide-react";
import {
  Button,
  Checkbox,
  Input,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import ax from "@/config/axios";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { Candidate } from "@shared-types/Candidate";

interface DataTableProps<TData extends Candidate> {
  data: TData[];
  type: "pending" | "active";
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
  onDataChange?: () => void; // New callback for data changes
}

export function DataTable<TData extends Candidate>({
  data = [],
  type,
  setData,
  onDataChange,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState<TData | null>(
    null
  );
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const {
    isOpen: isAcceptModalOpen,
    onOpen: onOpenAcceptModal,
    onClose: onCloseAcceptModal,
  } = useDisclosure();
  const {
    isOpen: isRejectModalOpen,
    onOpen: onOpenRejectModal,
    onClose: onCloseRejectModal,
  } = useDisclosure();
  const {
    isOpen: isRemoveModalOpen,
    onOpen: onOpenRemoveModal,
    onClose: onCloseRemoveModal,
  } = useDisclosure();

  const { getToken } = useAuth();
  const axios = ax(getToken);

  const handleAcceptCandidate = (id: string) => {
    setIsAccepting(true);
    axios
      .post(`/institutes/candidate/${id}/accept`)
      .then(() => {
        toast.success("Candidate Accepted Successfully");
        // Update local state
        setData((prev) => prev.filter((candidate) => candidate._id !== id));
        // Refresh data from server to ensure consistency
        if (onDataChange) onDataChange();
        onCloseAcceptModal();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "An Error Occurred");
      })
      .finally(() => {
        setIsAccepting(false);
      });
  };

  const handleRejectCandidate = (id: string) => {
    setIsRejecting(true);
    axios
      .post(`/institutes/candidate/${id}/reject`)
      .then(() => {
        toast.success("Candidate Rejected Successfully");
        // Update local state
        setData((prev) => prev.filter((candidate) => candidate._id !== id));
        // Refresh data from server to ensure consistency
        if (onDataChange) onDataChange();
        onCloseRejectModal();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "An Error Occurred");
      })
      .finally(() => {
        setIsRejecting(false);
      });
  };

  const handleRemoveCandidate = (id: string) => {
    setIsRemoving(true);
    axios
      .post(`/institutes/candidate/${id}/remove`)
      .then(() => {
        toast.success("Candidate Removed Successfully");
        // Update local state
        setData((prev) => prev.filter((candidate) => candidate._id !== id));
        // Refresh data from server to ensure consistency
        if (onDataChange) onDataChange();
        onCloseRemoveModal();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "An Error Occurred");
      })
      .finally(() => {
        setIsRemoving(false);
      });
  };

  const columns: ColumnDef<TData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          isSelected={
            (table.getIsAllPageRowsSelected() as boolean) ||
            table.getIsSomePageRowsSelected()
          }
          onValueChange={(value) => table.toggleAllPageRowsSelected(value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isSelected={row.getIsSelected()}
          onValueChange={(value) => row.toggleSelected(value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "instituteUid",
      header: ({ column }) => {
        return (
          <Button
            variant="light"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unique ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="light"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="light"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "candidate.createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="light"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Profile Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        return createdAt ? new Date(createdAt).toDateString() : "N/A";
      },
    },
    {
      id: "actions",
      cell: (row) => {
        return (
          <div className="flex space-x-2">
            {type === "pending" && (
              <Tooltip content="Accept">
                <Button
                  isIconOnly
                  variant="flat"
                  color={"success"}
                  onPress={() => {
                    setSelectedCandidate(row.row.original);
                    onOpenAcceptModal();
                  }}
                >
                  <Check />
                </Button>
              </Tooltip>
            )}

            <Tooltip content="View Profile">
              <Button
                isIconOnly
                variant="flat"
                color="primary"
                onPress={() => window.open(`/c/${row.row.original._id}`)}
              >
                <Eye />
              </Button>
            </Tooltip>

            {type === "pending" && (
              <Tooltip content="Reject">
                <Button
                  isIconOnly
                  variant="flat"
                  color="danger"
                  onPress={() => {
                    setSelectedCandidate(row.row.original);
                    onOpenRejectModal();
                  }}
                >
                  <X />
                </Button>
              </Tooltip>
            )}

            {type === "active" && (
              <Tooltip content="Remove from Campus">
                <Button
                  isIconOnly
                  variant="flat"
                  color="danger"
                  onPress={() => {
                    setSelectedCandidate(row.row.original);
                    onOpenRemoveModal();
                  }}
                >
                  <UserMinusIcon />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: { pageSize: 10, pageIndex: pageIndex },
    },
  });

  return (
    <>
      <div className="rounded-md">
        <div className="flex items-center gap-5">
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              onClick={() => setPageIndex(pageIndex - 1)}
              isDisabled={!table.getCanPreviousPage()}
              isIconOnly
            >
              <ChevronLeft />
            </Button>
            <Button
              onClick={() => setPageIndex(pageIndex + 1)}
              isDisabled={!table.getCanNextPage()}
              isIconOnly
            >
              <ChevronRight />
            </Button>
          </div>
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <Table className="mt-5">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Accept Modal */}
      <Modal isOpen={isAcceptModalOpen} onClose={onCloseAcceptModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Accept Candidate
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to accept{" "}
                  <strong>{selectedCandidate?.name}</strong>?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isAccepting}
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  isLoading={isAccepting}
                  onPress={() =>
                    handleAcceptCandidate(selectedCandidate?._id || "")
                  }
                >
                  Accept
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={onCloseRejectModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reject Candidate
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to reject{" "}
                  <strong>{selectedCandidate?.name}</strong>?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isRejecting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isRejecting}
                  onPress={() =>
                    handleRejectCandidate(selectedCandidate?._id || "")
                  }
                >
                  Reject
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Remove Modal */}
      <Modal isOpen={isRemoveModalOpen} onClose={onCloseRemoveModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Remove Candidate
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to remove{" "}
                  <strong>{selectedCandidate?.name}</strong> from the campus?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isRemoving}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isRemoving}
                  onPress={() =>
                    handleRemoveCandidate(selectedCandidate?._id || "")
                  }
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
