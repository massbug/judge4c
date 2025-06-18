import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col p-4">
          <DataTable data={[]} />
        </div>
      </div>
    </div>
  )
}
