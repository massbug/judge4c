import { redirect } from "next/navigation";

export default function NewProblemPage() {
  redirect("/dashboard/problemset/new/metadata");
}
