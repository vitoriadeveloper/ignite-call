import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { Container, Header } from "../styles";
import {
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from "./styles";
import { ArrowRight } from "phosphor-react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "@/src/utils/get-week-days";

const timeIntervalsFormSchema = z.object({});

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      intervals: [
        { weekday: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekday: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekday: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  });

  const weekDays = getWeekDays();
  const { fields } = useFieldArray({
    control,
    name: "intervals",
  }); // to traverse and iterate the array

  const intervals = watch("intervals");
  async function handleSetTimeIntervals() {}
  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalsContainer>
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true);
                          }}
                          checked={field.value}
                        />
                      );
                    }}
                  />

                  <Text>{weekDays[field.weekday]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    crossOrigin={undefined}
                    {...register(`intervals.${index}.startTime`)}
                    disabled={intervals[index].enabled === false}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    crossOrigin={undefined}
                    {...register(`intervals.${index}.endTime`)}
                    disabled={intervals[index].enabled === false}
                  />
                </IntervalInputs>
              </IntervalItem>
            );
          })}
        </IntervalsContainer>
        <Button type="submit">
          Proximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  );
}
