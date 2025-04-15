import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, signOut } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";
import LogInButton from "@/components/log-in-button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SettingsButton } from "@/components/settings-button";

const UserAvatar = ({ image, name }: { image: string; name: string }) => (
  <Avatar className="h-8 w-8 rounded-lg">
    <AvatarImage src={image} alt={name} />
    <Skeleton className="h-full w-full" />
  </Avatar>
);

async function handleLogOut() {
  "use server";
  await signOut();
}

export async function AvatarButton() {
  const session = await auth();
  const t = await getTranslations("AvatarButton");
  const isLoggedIn = !!session?.user;
  const image = session?.user?.image ?? "https://github.com/shadcn.png";
  const name = session?.user?.name ?? "unknown";
  const email = session?.user?.email ?? "unknwon@example.com";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar image={image} name={name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={8}
      >
        {!isLoggedIn ? (
          <DropdownMenuGroup>
            <SettingsButton />
            <LogInButton />
          </DropdownMenuGroup>
        ) : (
          <>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar image={image} name={name} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <SettingsButton />
              <DropdownMenuItem onClick={handleLogOut}>
                <LogOut />
                {t("LogOut")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
