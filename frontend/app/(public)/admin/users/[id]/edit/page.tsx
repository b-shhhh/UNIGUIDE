import { notFound } from "next/navigation";
import { getAdminUserById } from "@/lib/api/admin/user";
import UpdateUserForm from "../../../_components/UpdateUserForm";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Params) {
  const { id } = await params;
  const response = await getAdminUserById(id);
  const user = response.data;

  if (!user) {
    notFound();
  }

  return <UpdateUserForm user={user} />;
}
