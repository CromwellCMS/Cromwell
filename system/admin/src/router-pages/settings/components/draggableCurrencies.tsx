import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { FieldArrayWithId, useFieldArray, UseFieldArrayRemove, useFormContext } from 'react-hook-form';

import { GrabIcon } from '../../../components/icons/grabIcon';
import { TextInput } from '../../../components/inputs/TextInput/TextInput';
import { TAdminCmsSettingsType } from '../../../hooks/useAdminSettings';

type FormType = Pick<TAdminCmsSettingsType, 'defaultShippingPrice' | 'currencies'>;

export function CurrencyItem(props: {
  idx?: number;
  id?: any;
  field?: FieldArrayWithId<FormType, 'currencies', 'id'>;
  remove?: UseFieldArrayRemove;
  primary?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });
  const { register, watch, getValues } = useFormContext();
  const { idx, remove, primary } = props;
  const symbol = watch(`currencies.${idx}.symbol`, getValues(`currencies.${idx}.symbol`));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border cursor-default ${
        isDragging ? 'shadow-indigo-400 border-indigo-500' : ''
      } rounded-md shadow-lg w-full p-3`}
    >
      <div className="mb-2 block">
        {primary && <span className="rounded-xl bg-indigo-700 text-white text-xs text-center py-1 px-3">primary</span>}
      </div>
      <div className="flex flex-row gap-1 justify-between">
        <div className="font-bold mr-2 text-2xl text-indigo-600">{symbol}</div>
        <div className="w-full grid gap-4 grid-cols-1 justify-self-stretch lg:grid-cols-2">
          <TextInput label="Title" {...register(`currencies.${idx}.title`)} />
          <TextInput label="Tag (Short Code)" {...register(`currencies.${idx}.tag`)} />
          <TextInput label="Ratio" {...register(`currencies.${idx}.ratio`)} />
          <TextInput label="Symbol" {...register(`currencies.${idx}.symbol`)} />
          <div />
          <div
            onClick={() => remove(idx)}
            className="cursor-pointer flex mt-5 text-xs text-gray-500 justify-self-end hover:text-red-500"
          >
            <TrashIcon className="h-4 w-4 self-center inline-block" />
            <span className="ml-2">delete</span>
          </div>
        </div>
        <div className="rounded-md flex h-full grow hover:bg-indigo-100" {...listeners} {...attributes}>
          <GrabIcon className="rounded-md cursor-grab mx-auto h-7 mr-2 p-1 w-7 self-center  " />
        </div>
      </div>
    </div>
  );
}

export const DraggableCurrenciesList = () => {
  const { control } = useFormContext<FormType>();
  const { fields, remove, move, insert } = useFieldArray({
    control,
    name: 'currencies',
    keyName: 'id',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="">
      <div className="flex flex-row mb-2 gap-2 justify-between">
        <p className="font-bold my-1 self-center">Currencies</p>
        <button
          type="button"
          onClick={() =>
            insert(fields.length, {
              id: 'new',
              tag: 'ABC',
              ratio: 1,
              symbol: '&',
              title: 'New Currency',
            })
          }
          className="rounded-lg flex text-xs py-1 px-2 text-gray-500 self-center hover:bg-indigo-50 hover:text-indigo-500"
        >
          <PlusIcon className="h-3 top-[1px] w-3 self-center relative" />
          <span className="ml-1 self-center">add</span>
        </button>
      </div>
      <div className="grid gap-2 grid-cols-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            {fields.map((field, id) => (
              <CurrencyItem key={field.id} id={field.id} idx={id} primary={id === 0} remove={remove} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeItm = fields.find((f) => f.id === active.id);
      const overItm = fields.find((f) => f.id === over.id);
      const activeIndex = fields.indexOf(activeItm);
      const overIndex = fields.indexOf(overItm);
      move(activeIndex, overIndex);
    }
  }
};
