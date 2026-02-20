import SalaryOracle from "@/components/predict/SalaryPredict";
import { db } from "@/db/db";
import { salaries } from "@/db/schema";
import { FC } from "react";

const Page: FC = async () => {
  const allSalaries = await db.select().from(salaries);

  return <SalaryOracle history={allSalaries} />;
};

export default Page;
