import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FieldArrayWithId, useFieldArray, UseFieldArrayRemove, useFormContext } from 'react-hook-form';
import { TextInput } from '../../../components/inputs/TextInput/TextInput';
import { TAdminCmsSettingsType } from '../../../hooks/useAdminSettings';
import { GrabIcon } from '../../../components/icons/grabIcon';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getRandStr, TCustomFieldType } from '@cromwell/core';
import { CustomEntityFormType } from '../pages/custom/customEntity';
import { RegisteredSelectField } from './registeredSelectField';
import { slugify } from '../../../helpers/slugify';

type AdminSettings = Pick<TAdminCmsSettingsType, 'customFields'>;

type Options = {
  value: TCustomFieldType;
  label: string;
};

const selectOptions: Options[] = [
  { value: 'Simple text', label: 'Text' },
  { value: 'Text editor', label: 'Text Editor' },
  { value: 'Select', label: 'Select/Dropdown' },
  { value: 'Image', label: 'Image' },
  { value: 'Gallery', label: 'Image Gallery' },
  { value: 'Color', label: 'Colorpicker' },
];

const getValue = (v: Options) => v.value;
const getLabel = (v: Options) => v.label;
const inferValue = (v: string) => selectOptions.find((k) => k.value === v);

export function EntityFieldItem(props: {
  idx?: number;
  id?: any;
  field?: FieldArrayWithId<CustomEntityFormType, 'customFields', 'id'>;
  remove?: UseFieldArrayRemove;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });
  const { register, watch, getValues, setValue } = useFormContext<CustomEntityFormType>();
  const { idx, remove } = props;

  const optionMethods = useFieldArray({
    name: `customFields.${idx}.options` as const,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const showOptions = watch(`customFields.${idx}.fieldType`, getValues(`customFields.${idx}.fieldType`)) === 'Select';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border cursor-default ${
        isDragging ? 'shadow-indigo-400 border-indigo-500 select-none' : ''
      } rounded-md shadow-lg w-full p-3`}
    >
      <div className="flex flex-row gap-1 justify-between">
        <div className="w-full grid gap-4 grid-cols-1 justify-self-stretch lg:grid-cols-2">
          <TextInput label="ID" disabled {...register(`customFields.${idx}.id`)} />
          <TextInput
            label="Label"
            {...register(`customFields.${idx}.label`, {
              onChange: (e) => {
                setValue(`customFields.${idx}.key`, slugify(e.target.value));
              },
            })}
          />
          <TextInput label="Key (internal)" {...register(`customFields.${idx}.key`)} />
          <RegisteredSelectField
            options={selectOptions}
            getDisplayValue={getLabel}
            getValue={getValue}
            inferValue={inferValue}
            label="Input Type"
            name={`customFields.${idx}.fieldType`}
          />
          <div />
          <div>
            {showOptions && (
              <>
                <div className="flex gap-2 justify-between">
                  <p className="font-bold text-sm text-gray-700">Options</p>
                  <button
                    type="button"
                    onClick={() => optionMethods.append('', { shouldFocus: true })}
                    className="rounded-lg flex text-xs py-1 px-2 text-gray-500 self-center hover:bg-indigo-50 hover:text-indigo-500"
                  >
                    <PlusIcon className="h-3 top-[1px] w-3 self-center relative" />
                    <span className="ml-1 self-center">add</span>
                  </button>
                </div>
                <div className="rounded-md flex flex-col bg-gray-200 shadow-inner min-h-[25px] p-1 gap-1">
                  {optionMethods.fields.map((option, oIdx) => (
                    <div key={oIdx} className="flex flex-row w-full gap-1">
                      <TextInput
                        key={oIdx}
                        label={<span className="text-xs">Option {oIdx + 1}</span>}
                        className="!text-xs"
                        {...register(`customFields.${idx}.options.${oIdx}`, {})}
                      />
                      <button
                        onClick={() => optionMethods.remove(oIdx)}
                        type="button"
                        className="mb-2 text-gray-600 self-end hover:text-red-500"
                      >
                        <TrashIcon className="h-4 w-4 self-center inline-block" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div />
          <div
            onClick={() => remove(idx)}
            className="cursor-pointer flex mt-5 text-xs text-gray-500 justify-self-end hover:text-red-500"
          >
            <TrashIcon className="h-4 w-4 self-center inline-block" />
            <span className="ml-2">delete</span>
          </div>
        </div>
        <div className="rounded-md flex h-full grow touch-none hover:bg-indigo-100" {...listeners} {...attributes}>
          <GrabIcon className="rounded-md cursor-grab mx-auto h-7 mr-2 p-1 w-7 self-center  " />
        </div>
      </div>
    </div>
  );
}

export const DraggableEntityFields = ({ entityType }: { entityType: string }) => {
  const { control } = useFormContext<AdminSettings>();
  const { fields, remove, move, insert } = useFieldArray({
    control,
    name: 'customFields',
    keyName: 'id',
  });

  const sensors = useSensors(
    // useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="">
      <div className="flex flex-row mb-2 gap-2 justify-between">
        <p className="font-bold my-1 self-center">Entity Fields</p>
        <button
          type="button"
          onClick={() =>
            insert(fields.length, {
              id: getRandStr(8),
              entityType: entityType,
              fieldType: 'Simple text',
              key: '',
              label: '',
              order: fields.length,
            })
          }
          className="rounded-lg flex text-xs py-1 px-2 text-gray-500 self-center hover:bg-indigo-50 hover:text-indigo-500"
        >
          <PlusIcon className="h-3 top-[1px] w-3 self-center relative" />
          <span className="ml-1 self-center">add</span>
        </button>
      </div>
      <div className="rounded-md flex flex-col bg-gray-300 shadow-inner w-full p-2 gap-2">
        {(!fields || fields.length === 0) && (
          <div className="text-base text-center w-full text-gray-700 self-center">
            No custom fields yet. Click on + add to add new custom fields.
          </div>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} autoScroll onDragEnd={handleDragEnd}>
          <SortableContext items={fields} strategy={verticalListSortingStrategy}>
            {fields.map((field, id) => (
              <EntityFieldItem key={field.id} id={field.id} idx={id} remove={remove} />
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
