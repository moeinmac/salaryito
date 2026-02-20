import SalaryDashboard from "@/components/charts/charts";
import { db } from "@/db/db";
import { salaries } from "@/db/schema";
import { FC } from "react";

const Page: FC = async () => {
  const allSalaries = await db.select().from(salaries);

  return <SalaryDashboard data={allSalaries} />;
};

export default Page;
