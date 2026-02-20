"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useForm } from "react-hook-form";
import DatePicker, { DateObject } from "react-multi-date-picker";
import * as z from "zod";

import { addSalaryRecord } from "@/actions/salary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns-jalali";

const formSchema = z.object({
  date: z.any().refine((val) => val instanceof DateObject, "تاریخ را انتخاب کنید"),
  time: z.string().min(5, "زمان را وارد کنید (مثلا ۱۶:۳۰)"),
});

export default function SalaryForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { time: format(new Date(), "HH:mm") },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const date = values.date.toDate();
    const [hours, minutes] = values.time.split(":").map(Number);
    date.setHours(hours, minutes);

    const formData = new FormData();
    formData.append("paidAt", date.toISOString());

    const res = await addSalaryRecord(formData);

    setLoading(false);
    if (res.success) {
      toast("اطلاعات با موفقیت ذخیره شد.");
      form.reset();
    } else {
      toast("مشکلی پیش آمد");
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto dir-rtl font-vazir">
      <CardHeader>
        <CardTitle className="text-xl text-right">ثبت واریزی جدید</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-right">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاریخ واریز (شمسی)</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      calendar={persian}
                      locale={persian_fa}
                      calendarPosition="bottom-right"
                      inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      containerStyle={{ width: "100%" }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ساعت واریز</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="text-left" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "ذخیره تراکنش"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
