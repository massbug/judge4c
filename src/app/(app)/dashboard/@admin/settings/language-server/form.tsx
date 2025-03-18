"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorLanguage, LanguageServerProtocol } from "@prisma/client";
import { handleLanguageServerConfigSubmit } from "@/app/actions/language-server";

const settingsLanguageServerFormSchema = z.object({
  protocol: z.nativeEnum(LanguageServerProtocol),
  hostname: z.string(),
  port: z
    .number()
    .nullable()
    .transform((val) => (val === undefined ? null : val)),
  path: z
    .string()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
});

export type SettingsLanguageServerFormValues = z.infer<typeof settingsLanguageServerFormSchema>;

interface SettingsLanguageServerFormProps {
  defaultValues: Partial<SettingsLanguageServerFormValues>;
  language: EditorLanguage;
}

export function SettingsLanguageServerForm({
  defaultValues,
  language,
}: SettingsLanguageServerFormProps) {
  const form = useForm<SettingsLanguageServerFormValues>({
    resolver: zodResolver(settingsLanguageServerFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: SettingsLanguageServerFormValues) => {
    await handleLanguageServerConfigSubmit(language, data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-7">
        <FormField
          control={form.control}
          name="protocol"
          render={({ field }) => (
            <FormItem className="pt-0 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <FormLabel>Protocol</FormLabel>
                <FormDescription>
                  This is the protocol of the language server.
                </FormDescription>
              </div>
              <div className="space-y-2">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a protocol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="wss">wss</SelectItem>
                    <SelectItem value="ws">ws</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="hostname"
          render={({ field }) => (
            <FormItem className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <FormLabel>Hostname</FormLabel>
                <FormDescription>
                  This is the hostname of the language server.
                </FormDescription>
              </div>
              <div className="space-y-2">
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="port"
          render={({ field }) => (
            <FormItem className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <FormLabel>Port</FormLabel>
                <FormDescription>
                  This is the port of the language server.
                </FormDescription>
              </div>
              <div className="space-y-2">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? null : Number(value));
                    }}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem className="pt-4 pb-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <FormLabel>Path</FormLabel>
                <FormDescription>
                  This is the path of the language server.
                </FormDescription>
              </div>
              <div className="space-y-2">
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
