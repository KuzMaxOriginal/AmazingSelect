import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core"
import {
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import AmazingTag from "./AmazingTag"

export default function AmazingTags(props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active && over && active.id !== over.id) {
      props.onMove(active, over)
    }
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={props.values} strategy={rectSwappingStrategy}>
        {props.values.map((id) => (
          <AmazingTag
            onDelete={props.onDelete}
            key={id.label}
            value={id}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
};