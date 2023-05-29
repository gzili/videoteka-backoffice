import { useController } from "react-hook-form";

export function ControlledField(props) {
  const { control, name, render } = props;

  const { field, fieldState: { error } } = useController({
    name,
    control,
  });

  return render({ ...field, errorMessage: error?.message });
}