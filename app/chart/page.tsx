import SalaryForm from "@/components/salary-form/salary-form";
import { FC } from "react";

const chartPage: FC = async () => {
  return (
    <div>
      <h1>اضافه کردن یک رکورد جدید</h1>
      <SalaryForm />
    </div>
  );
};

export default chartPage;
