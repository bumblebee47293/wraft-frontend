import React, { useEffect } from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Label,
  Text,
  useThemeUI,
} from 'theme-ui';
import { DragIcon } from '@wraft/icon';
import { CSS } from '@dnd-kit/utilities';

type Props = {
  items: any;
  setItems: any;
};

const FormsFrom = ({ items, setItems }: Props) => {
  const onAddField = (type: 'email' | 'date' | 'time' | 'text' | 'options') => {
    const newItem: any = {
      name: '',
      type: type,
      id: Math.random().toString(),
      required: false,
    };
    if (type === 'text') {
      newItem.long = false;
    } else if (type === 'options') {
      newItem.multiple = false;
      newItem.values = [];
    }
    if (items) {
      setItems([...items, newItem]);
    } else {
      setItems([newItem]);
    }
  };

  const onAddOption = (id: string) => {
    const newItem = items.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          values: [...item.values, { name: '', id: Math.random().toString() }],
        };
      }
      return item;
    });
    setItems(newItem);
  };

  const onRequiredChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].required === checked) {
      data[index].required = false;
    } else {
      data[index].required = checked;
    }
    setItems(data);
  };

  const onLongChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].long === checked) {
      data[index].long = false;
    } else {
      data[index].long = checked;
    }
    setItems(data);
  };

  const onMultipleChecked = (e: any, index: number) => {
    const { checked } = e.target;
    const data = [...items];
    if (data[index].multiple === checked) {
      data[index].multiple = false;
    } else {
      data[index].multiple = checked;
    }
    setItems(data);
  };

  const onNameChange = (e: any, item: any) => {
    const newName = e.target.value;
    const newItem = {
      ...item,
      name: newName,
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  const onOptionNameChange = (e: any, item: any, value: any) => {
    const newName = e.target.value;
    const newValue = {
      ...value,
      name: newName,
    };
    const newItem = {
      ...item,
      values: item.values.map((s: any) => {
        if (s.id === value.id) {
          return newValue;
        } else {
          return s;
        }
      }),
    };
    const newArr = items.map((s: any) => {
      if (s.id === item.id) {
        return newItem;
      } else {
        return s;
      }
    });
    setItems(newArr);
  };

  useEffect(() => {
    console.table(items);
  }, [items]);

  return (
    <div>
      <Box>
        {items &&
          items.map((item: any, index: number) => (
            <Box key={item.id} sx={{ mt: 3 }}>
              <Label>Field Name</Label>
              <Input
                defaultValue={item.name}
                placeholder="Name"
                onChange={(e) => onNameChange(e, item)}></Input>
              {item.type === 'options' && (
                <Box mt={3}>
                  <Label>Options</Label>
                  <DraggableValues
                    item={item}
                    items={items}
                    setItems={setItems}
                    onOptionNameChange={onOptionNameChange}
                  />
                  <Box mt={3}>
                    <Button
                      variant="secondary"
                      onClick={() => onAddOption(item.id)}>
                      Add Option
                    </Button>
                  </Box>
                </Box>
              )}
              <Flex sx={{ gap: 3, mt: 3 }}>
                <Box>
                  <Label sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Checkbox
                      checked={item.required}
                      onChange={(e) => onRequiredChecked(e, index)}></Checkbox>
                    <Text> Required</Text>
                  </Label>
                </Box>
                {item.type === 'text' && (
                  <Box>
                    <Label
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}>
                      <Checkbox
                        checked={item.long}
                        onChange={(e) => onLongChecked(e, index)}></Checkbox>
                      <Text>Long Answer</Text>
                    </Label>
                  </Box>
                )}
                {item.type === 'options' && (
                  <Box>
                    <Label
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}>
                      <Checkbox
                        checked={item.long}
                        onChange={(e) =>
                          onMultipleChecked(e, index)
                        }></Checkbox>
                      <Text>Multiple Answers</Text>
                    </Label>
                  </Box>
                )}
              </Flex>
            </Box>
          ))}
      </Box>
      <Flex sx={{ gap: 3, mt: 4 }}>
        <Button onClick={() => onAddField('text')}>Text</Button>
        <Button onClick={() => onAddField('options')}>Options</Button>
        <Button onClick={() => onAddField('date')}>Date</Button>
        <Button onClick={() => onAddField('time')}>Time</Button>
        <Button onClick={() => onAddField('email')}>Email</Button>
      </Flex>
    </div>
  );
};

export default FormsFrom;

type DraggableValuesProps = {
  item: any;
  items: any;
  setItems: any;
  onOptionNameChange: any;
};

const DraggableValues = ({
  item,
  items,
  setItems,
  onOptionNameChange,
}: DraggableValuesProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: any) => {
    if (!active || !over || active.id === over.id) return;
    console.log(active, over, active.id, over.id);
    const activeValue = item.values.filter((s: any) => s.id == active.id)[0];
    const overValue = item.values.filter((s: any) => s.id == over.id)[0];
    const oldIndex = item.values.indexOf(activeValue);
    const newIndex = item.values.indexOf(overValue);
    const cpyValues = [...item.values];
    const newArr = arrayMove(cpyValues, oldIndex, newIndex);
    const data = items.map((i: any) => {
      if (i.id === item.id) {
        return { ...i, values: newArr };
      } else return { ...i };
    });
    console.log(
      '🔥',
      activeValue,
      overValue,
      oldIndex,
      newIndex,
      newArr,
      data,
      '🔥',
    );

    setItems([]);
    setTimeout(() => {
      setItems(data);
    }, 0);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext items={item.values} strategy={rectSortingStrategy}>
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          {item.values.map((value: any, index: number) => (
            <SortableItem
              key={index}
              item={item}
              value={value}
              onOptionNameChange={onOptionNameChange}
            />
          ))}
        </Flex>
      </SortableContext>
    </DndContext>
  );
};

type SortableItemProps = {
  value: any;
  item: any;
  onOptionNameChange: any;
};
const SortableItem = ({
  value,
  item,
  onOptionNameChange,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: value.id,
  });
  const { theme } = useThemeUI();
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Box
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          flexShrink: 0,
        }}>
        <Box
          as="div"
          style={{
            transform: CSS.Transform.toString(transform),
            transition: transition,
            display: 'flex',
            padding: '16px',
          }}>
          <DragIcon
            color={theme?.colors?.gray?.[200] || ''}
            width={20}
            height={20}
            viewBox="0 0 24 24"
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          transform: CSS.Transform.toString(transform),
          transition: transition,
          bg: 'white',
          borderRadius: '4px',
        }}>
        <Flex
          sx={{
            position: 'relative',
            button: {
              display: 'none',
            },
            ':hover button': {
              display: 'block',
            },
            border: '1px solid',
            borderColor: 'border',
            borderRadius: '4px',
          }}>
          <Input
            className={`${isDragging ? 'z-10' : ''}`}
            defaultValue={value.name}
            onChange={(e) => {
              onOptionNameChange(e, item, value);
            }}
          />
        </Flex>
      </Box>
    </Flex>
  );
};
