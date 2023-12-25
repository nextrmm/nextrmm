"use client";

import { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { I18nDict } from "~/types";

interface Props {
  dictionary: I18nDict;
  id: string;
}

export function AddDeviceDialog({ dictionary, id }: Props) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationId, setLocationId] = useState("");
  const [deviceId, setDeviceId] = useState("");

  const locations = api.location.getAll.useQuery();
  const addDevice = api.device.add.useMutation({
    onSuccess: () => {
      setDeviceId("");
      toast({
        description: dictionary.successToast,
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: dictionary.errorToast,
      });
    },
  });

  const submit = async () => {
    addDevice.mutate({ device: deviceId, locationId: locationId });
  };

  function Content() {
    if (locations.status === "loading") {
      return <span>{dictionary["location-fetch-loading"]}</span>;
    }
    if (locations.status === "error") {
      return <span>{dictionary["location-fetch-error"]}</span>;
    }

    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="locationName" className="text-right">
          {dictionary["location-name"]}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between"
            >
              {locationName
                ? locations.data.find((location) => location.id === locationId)
                    ?.name
                : dictionary["location-select"]}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput
                placeholder={dictionary["location-input-placeholder"]}
                className="h-9"
              />
              <CommandEmpty>
                {dictionary["location-empty-placeholder"]}
              </CommandEmpty>
              <CommandGroup>
                {locations.data.map((location) => (
                  <CommandItem
                    key={location.id}
                    value={location.id}
                    onSelect={(currentValue) => {
                      setLocationId(
                        currentValue === locationId ? "" : currentValue,
                      );
                      setLocationName(
                        locations.data.find(
                          (location) => location.id === currentValue,
                        )!.name,
                      );
                      setOpen(false);
                    }}
                  >
                    {location.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        locationName === location.name
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <span
            className="text-lg font-semibold text-primary hover:cursor-pointer"
            onClick={() => locations.refetch()}
          >
            {dictionary.title}
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{dictionary.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Content />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {dictionary.name}
              </Label>
              <Input
                id="name"
                className="w-[400px]"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={submit}
              disabled={addDevice.isLoading}
            >
              {addDevice.isLoading ? dictionary.wait : dictionary.add}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="mb-2 text-sm">{dictionary.description}</p>
    </div>
  );
}
