import { Input, InputProps, Label, XStack } from "tamagui";
import { _GAP } from "../settings";

export default function StringInputField({
  name,
  idroot,
  currVal,
  onInput,
  inputProps,
}: {
  name: string;
  idroot: string;
  currVal: string | undefined;
  onInput: (newVal: string) => void;
  inputProps?: InputProps
}) {
  return (
      <XStack gap={_GAP} alignItems="center" display={"flex"}>
          <Label htmlFor={`${idroot}-inp`} width={"40%"}>
              {name}
          </Label>
          <Input
              id={`${idroot}-inp`}
              value={currVal}
              onChangeText={onInput}
              flex={1}
              {...inputProps}
          ></Input>
      </XStack>
  );
}
