import Predict from "@/components/predict/predict";
import { db } from "@/db/db";
import { salaries } from "@/db/schema";
import { FC } from "react";

const Page: FC = async () => {
  const allSalaries = await db.select().from(salaries);
  return <Predict data={allSalaries} />;
};

export default Page;
