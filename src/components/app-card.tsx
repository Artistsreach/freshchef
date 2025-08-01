"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Trash, ExternalLink, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteApp } from "@/actions/delete-app";
import { toast } from "sonner";

type AppCardProps = {
  id: string;
  name: string;
  createdAt: Date;
  imageUrl?: string | null;
  onDelete?: () => void;
};

export function AppCard({
  id,
  name,
  createdAt,
  imageUrl,
  onDelete,
}: AppCardProps) {
  const router = useRouter();

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/app/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    await deleteApp(id);
    toast.success("App deleted successfully");
    if (onDelete) {
      onDelete();
    }

    console.log(`Delete app: ${id}`);
  };

  return (
    <Card className="border-b border rounded-md h-32 sm:h-36 relative w-full overflow-hidden">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="opacity-100"
        />
      )}
      <div className="absolute inset-0 z-10 flex flex-col justify-between">
        <div className="flex justify-end p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-md hover:bg-gray-100/20 dark:hover:bg-gray-800/20 focus:outline-none">
                <MoreVertical className="h-4 w-4 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpen}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 dark:text-red-400"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link href={`/app/${id}`} className="cursor-pointer block">
          <div className="p-3 sm:p-4 bg-black/20 backdrop-blur-sm">
            <CardHeader className="p-0">
              <CardTitle className="text-sm sm:text-base truncate text-white">
                {name}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-gray-200">
                Created {createdAt.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
          </div>
        </Link>
      </div>
    </Card>
  );
}
