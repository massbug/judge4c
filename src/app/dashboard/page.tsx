import { DataTable } from "@/components/data-table"
import { SiteHeader } from "@/components/site-header"

import data from "./data.json"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col p-4">
          <DataTable data={data} />
        </div>
      </div>
    </div>
  )
}
